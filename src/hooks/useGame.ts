import { useState, useCallback, useEffect } from 'react'
import type { GameState, Player, BoardType } from '@/types/game.types'
import { useSocket } from './useSocket'
import {
    callBingoApi,
    confirmProposalApi,
    createRoomApi,
    getPlayers,
    getRoomStateApi,
    joinRoomApi,
    proposeNumberApi,
    startGameApi,
    strikeApi,
} from '@/services/v1/bingo.service'
import { clearGameSession, getGameSession, saveGameSession } from '@/utils/storage'

const initialGameState: GameState = {
    room: null,
    currentPlayer: null,
    isConnected: false,
    gameStatus: 'waiting',
    winner: null,
    lastCalledNumber: null,
    pendingProposal: null,
    isProposalModalVisible: false,
}

export const useGame = () => {
    const [gameState, setGameState] = useState<GameState>(initialGameState)
    const [loading, setLoading] = useState<boolean>(false)
    const [isRestoring, setIsRestoring] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const { socket, connect } = useSocket()

    const handlePlayerJoined = useCallback((data: { players: Player[] }) => {
        setGameState((prev) => ({
            ...prev,
            room: prev.room ? { ...prev.room, players: data.players } : null,
        }))
    }, [])

    const handleGameStarted = useCallback((data: any) => {
        setGameState((prev) => ({
            ...prev,
            gameStatus: 'playing',
            room: prev.room
                ? {
                      ...prev.room,
                      started: true,
                      calledNumbers: data.calledNumbers,
                      turn: data.turn,
                  }
                : null,
        }))
    }, [])

    const handleOpponentProposed = useCallback((data: { number: number; by: string }) => {
        setGameState((prev) => ({
            ...prev,
            pendingProposal: data,
        }))
    }, [])

    const hideProposalModal = useCallback(() => {
        setGameState((prev) => ({
            ...prev,
            isProposalModalVisible: false,
        }))
    }, [])

    const showProposalModal = useCallback(() => {
        setGameState((prev) => ({
            ...prev,
            isProposalModalVisible: true,
        }))
    }, [])

    useEffect(() => {
        if (gameState.pendingProposal) {
            setGameState((prev) => ({
                ...prev,
                isProposalModalVisible: true,
            }))
        }
    }, [gameState?.pendingProposal?.number, gameState?.pendingProposal?.by, gameState.pendingProposal])

    const handleProposalConfirmed = useCallback((data: any) => {
        console.log('Proposal confirmed data:', data)

        setGameState((prev) => {
            if (!prev.room || !prev.currentPlayer) return prev

            const updatedPlayers = prev.room.players.map((player) => {
                const updatedPlayer = data.players.find((p: { _id: string; id: string }) => p._id === player._id || p.id === player._id)
                if (updatedPlayer) {
                    return {
                        ...player,
                        marked: updatedPlayer.marked || player.marked,
                    }
                }
                return player
            })

            const updatedCurrentPlayer = data.players.find(
                (p: { _id: string }) => p._id === prev.currentPlayer?._id,
            )

            return {
                ...prev,
                room: {
                    ...prev.room,
                    calledNumbers: data.calledNumbers || prev.room.calledNumbers,
                    turn: data.turn || prev.room.turn,
                    players: updatedPlayers,
                },
                currentPlayer: updatedCurrentPlayer
                    ? {
                          ...prev.currentPlayer,
                          marked: updatedCurrentPlayer.marked,
                      }
                    : prev.currentPlayer,
                lastCalledNumber: data.number,
                pendingProposal: null,
            }
        })
    }, [])

    const handleGameOver = useCallback((data: { winner: string }) => {
        setGameState((prev) => ({
            ...prev,
            gameStatus: 'finished',
            winner: data.winner,
        }))
    }, [])

    const handleRoomClosed = useCallback(() => {
        window.location.reload()
        setError('Room was closed due to player disconnection')
    }, [])

    const handlePlayerStruck = useCallback(
        (data: any) => {
            setGameState((prev) => {
                if (!prev.room) return prev

                const updatedRoom = {
                    ...prev.room,
                    players: data.players,
                    turn: data.turn,
                }

                let updatedCurrentPlayer = prev.currentPlayer
                if (prev.currentPlayer && data.players) {
                    const currentPlayerData = data.players.find((p: { _id: string }) => p._id === prev.currentPlayer?._id)
                    if (currentPlayerData) {
                        updatedCurrentPlayer = {
                            ...prev.currentPlayer,
                            strikes: currentPlayerData.strikes,
                            bingoWord: currentPlayerData.bingoWord,
                        }
                    }
                }

                return {
                    ...prev,
                    room: updatedRoom,
                    currentPlayer: updatedCurrentPlayer,
                }
            })

            const strikeMessage = `${data.strikeType === 'row' ? 'Row' : 'Column'} ${data.strikeIndex + 1} struck!`
            const bingoMessage = data.struckBingoLetter ? ` ${data.struckBingoLetter} marked automatically!` : ''

            if (data.strikedBy === gameState.currentPlayer?._id) {
                console.log(`You struck ${strikeMessage}${bingoMessage}`)
            } else {
                console.log(`Opponent struck ${strikeMessage}${bingoMessage}`)
            }
        },
        [gameState.currentPlayer?._id],
    )

    useEffect(() => {
        const initSocket = async () => {
            const connected = await connect()
            setGameState((prev) => ({ ...prev, isConnected: connected }))
        }

        initSocket()

        socket.on('playerJoined', handlePlayerJoined)
        socket.on('gameStarted', handleGameStarted)
        socket.on('opponentProposed', handleOpponentProposed)
        socket.on('proposalConfirmed', handleProposalConfirmed)
        socket.on('gameOver', handleGameOver)
        socket.on('roomClosed', handleRoomClosed)
        socket.on('playerStruck', handlePlayerStruck)

        return () => {
            socket.off('playerJoined')
            socket.off('gameStarted')
            socket.off('opponentProposed')
            socket.off('proposalConfirmed')
            socket.off('gameOver')
            socket.off('roomClosed')
            socket.off('playerStruck')
        }
    }, [
        connect,
        handleGameOver,
        handleGameStarted,
        handleOpponentProposed,
        handlePlayerJoined,
        handlePlayerStruck,
        handleProposalConfirmed,
        handleRoomClosed,
        socket,
    ])

    const restoreGameState = useCallback(
        async (roomId: string, playerId: string) => {
            try {
                setIsRestoring(true)
                setError(null)

                const response = await getRoomStateApi(roomId, playerId)

                if (response.success) {
                    const { room, currentPlayer } = response.data

                    setGameState((prev) => ({
                        ...prev,
                        room: room,
                        currentPlayer: currentPlayer,
                        gameStatus: room.gameStatus,
                        pendingProposal: room.pendingProposal,
                        lastCalledNumber: room.calledNumbers[room.calledNumbers.length - 1] || null,
                        isConnected: true,
                    }))

                    if (socket) {
                        socket.joinRoom(roomId)
                    }

                    return true
                }

                return false
            } catch (error) {
                console.error('error: ', error);
                if (error instanceof Error) {
                    setError(error.message || 'Failed to restore game state')
                }

                clearGameSession()
                return false
            } finally {
                setIsRestoring(false)
            }
        },
        [socket],
    )

    const initializeGame = useCallback(async () => {
        const savedSession = getGameSession()

        if (savedSession) {
            console.log('Found saved session, restoring game state:', savedSession)
            const restored = await restoreGameState(savedSession.roomId, savedSession.playerId)

            if (!restored) {
                console.log('Failed to restore session, clearing saved data')
                clearGameSession()
            }
        }
    }, [restoreGameState])

    useEffect(() => {
        initializeGame()
    }, [initializeGame])

    const createRoom = useCallback(
        async (name: string, boardType: BoardType) => {
            try {
                setLoading(true)
                setError(null)

                const response = await createRoomApi({ name, boardType })
                if (response.success) {
                    const { roomId, player } = response.data

                    saveGameSession({
                        roomId,
                        playerId: player._id,
                        playerName: name,
                        boardType,
                        joinedAt: Date.now(),
                    })

                    socket.createRoom(roomId)

                    setGameState((prev) => ({
                        ...prev,
                        room: {
                            _id: '',
                            roomId,
                            boardType,
                            players: [player],
                            turn: player._id,
                            calledNumbers: [],
                            started: false,
                        },
                        currentPlayer: player,
                    }))

                    return roomId
                }
            } catch (error) {
                console.error('error: ', error)
                if (error instanceof Error) {
                    setError(error.message)
                }
            } finally {
                setLoading(false)
            }
        },
        [socket],
    )

    const joinRoom = useCallback(
        async (roomId: string, name: string) => {
            try {
                setLoading(true)
                setError(null)

                const response = await joinRoomApi({ roomId, name })
                if (response.success) {
                    const { player } = response.data

                    saveGameSession({
                        roomId,
                        playerId: player._id,
                        playerName: name,
                        boardType: player.boardType,
                        joinedAt: Date.now(),
                    })

                    socket.joinRoom(roomId)

                    const roomResponse = await getPlayers(roomId)
                    if (roomResponse.success) {
                        setGameState((prev) => ({
                            ...prev,
                            room: {
                                _id: '',
                                roomId,
                                boardType: player.boardType,
                                players: roomResponse.data,
                                turn: '',
                                calledNumbers: [],
                                started: false,
                            },
                            currentPlayer: player,
                        }))
                    }

                    return true
                }
            } catch (error) {
                console.error('error: ', error)
                if (error instanceof Error) {
                    setError(error.message)
                }
            } finally {
                setLoading(false)
            }
        },
        [socket],
    )

    const startGame = useCallback(async () => {
        if (!gameState.room?.roomId) return

        try {
            setLoading(true)
            await startGameApi({ roomId: gameState.room.roomId })
        } catch (error) {
            console.error('error: ', error)
            if (error instanceof Error) {
                setError(error.message)
            }
        } finally {
            setLoading(false)
        }
    }, [gameState.room?.roomId])

    const proposeNumber = useCallback(
        async (number: number) => {
            if (!gameState.room?.roomId || !gameState.currentPlayer?._id) return

            const payload = { roomId: gameState.room.roomId, playerId: gameState.currentPlayer._id, number: number }

            try {
                await proposeNumberApi(payload)
            } catch (error) {
                console.error('error: ', error)
                if (error instanceof Error) {
                    setError(error.message)
                }
            }
        },
        [gameState.room?.roomId, gameState.currentPlayer?._id],
    )

    const confirmProposal = useCallback(async () => {
        if (!gameState.room?.roomId || !gameState.currentPlayer?._id || !gameState.pendingProposal) return

        try {
            const proposedNumber = gameState.pendingProposal.number

            setGameState((prev) => {
                if (!prev.currentPlayer || !prev.room) return prev

                const updatedMarked = prev.currentPlayer.marked.map((row, rowIndex) =>
                    row.map((isMarked, colIndex) => {
                        const boardNumber = prev.currentPlayer!.board[rowIndex][colIndex]
                        return boardNumber === proposedNumber ? true : isMarked
                    }),
                )

                return {
                    ...prev,
                    currentPlayer: {
                        ...prev.currentPlayer,
                        marked: updatedMarked,
                    },
                    pendingProposal: null,
                }
            })

            await confirmProposalApi({ roomId: gameState.room.roomId, playerId: gameState.currentPlayer._id })
        } catch (error) {
            console.error('error: ', error)
            if (error instanceof Error) {
                setError(error.message)
            }
            setGameState((prev) => ({
                ...prev,
                pendingProposal: gameState.pendingProposal,
            }))
        }
    }, [gameState.room?.roomId, gameState.currentPlayer?._id, gameState.pendingProposal])

    const callBingo = useCallback(async () => {
        if (!gameState.room?.roomId || !gameState.currentPlayer?._id) return

        try {
            setLoading(true)
            const response = await callBingoApi({ roomId: gameState.room.roomId, playerId: gameState.currentPlayer._id })

            if (response.winner) {
                setGameState((prev) => ({
                    ...prev,
                    gameStatus: 'finished',
                    winner: gameState.currentPlayer?._id || null,
                }))
            }
        } catch (error) {
            console.error('error: ', error)
            if (error instanceof Error) {
                setError(error.message)
            }
        } finally {
            setLoading(false)
        }
    }, [gameState.room?.roomId, gameState.currentPlayer?._id])

    const resetGame = useCallback(() => {
        if (gameState.room?.roomId) {
            socket.leaveRoom(gameState.room.roomId)
        }
        clearGameSession()

        setGameState(initialGameState)
        setError(null)
    }, [gameState.room?.roomId, socket])

    const clearError = useCallback(() => {
        setError(null)
    }, [])

    const strikeRow = useCallback(
        async (rowIndex: number) => {
            if (!gameState.room?.roomId || !gameState.currentPlayer?._id) return

            try {
                setLoading(true)

                setGameState((prev) => {
                    if (!prev.currentPlayer) return prev

                    const updatedStrikes = { ...prev.currentPlayer.strikes }
                    updatedStrikes.rows[rowIndex] = true

                    return {
                        ...prev,
                        currentPlayer: {
                            ...prev.currentPlayer,
                            strikes: updatedStrikes,
                        },
                    }
                })

                await strikeApi({
                    roomId: gameState.room.roomId,
                    playerId: gameState.currentPlayer._id,
                    type: 'row',
                    index: rowIndex,
                })
            } catch (error) {
                console.error('error: ', error)
                if (error instanceof Error) {
                    setError(error.message)
                }
                setGameState((prev) => {
                    if (!prev.currentPlayer) return prev

                    const updatedStrikes = { ...prev.currentPlayer.strikes }
                    updatedStrikes.rows[rowIndex] = false

                    return {
                        ...prev,
                        currentPlayer: {
                            ...prev.currentPlayer,
                            strikes: updatedStrikes,
                        },
                    }
                })
            } finally {
                setLoading(false)
            }
        },
        [gameState.room?.roomId, gameState.currentPlayer?._id],
    )

    const strikeColumn = useCallback(
        async (colIndex: number) => {
            if (!gameState.room?.roomId || !gameState.currentPlayer?._id) return

            try {
                setLoading(true)

                setGameState((prev) => {
                    if (!prev.currentPlayer) return prev

                    const updatedStrikes = { ...prev.currentPlayer.strikes }
                    updatedStrikes.columns[colIndex] = true

                    return {
                        ...prev,
                        currentPlayer: {
                            ...prev.currentPlayer,
                            strikes: updatedStrikes,
                        },
                    }
                })

                await strikeApi({
                    roomId: gameState.room.roomId,
                    playerId: gameState.currentPlayer._id,
                    type: 'column',
                    index: colIndex,
                })
            } catch (error) {
                console.error('error: ', error)
                if (error instanceof Error) {
                    setError(error.message)
                }
                setGameState((prev) => {
                    if (!prev.currentPlayer) return prev

                    const updatedStrikes = { ...prev.currentPlayer.strikes }
                    updatedStrikes.columns[colIndex] = false

                    return {
                        ...prev,
                        currentPlayer: {
                            ...prev.currentPlayer,
                            strikes: updatedStrikes,
                        },
                    }
                })
            } finally {
                setLoading(false)
            }
        },
        [gameState.room?.roomId, gameState.currentPlayer?._id],
    )

    const refreshGameState = useCallback(async () => {
        if (!gameState.room?.roomId || !gameState.currentPlayer?._id) {
            setError('No active game to refresh')
            return false
        }

        return await restoreGameState(gameState.room.roomId, gameState.currentPlayer._id)
    }, [gameState.room?.roomId, gameState.currentPlayer?._id, restoreGameState])

    return {
        gameState,
        loading,
        isRestoring,
        error,
        restoreGameState,
        refreshGameState,
        initializeGame,
        hideProposalModal,
        showProposalModal,
        createRoom,
        joinRoom,
        startGame,
        proposeNumber,
        confirmProposal,
        callBingo,
        resetGame,
        clearError,
        setGameState,
        strikeRow,
        strikeColumn,
    }
}
