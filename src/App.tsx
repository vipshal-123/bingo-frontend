import Toast from './components/common/Toast'
import GameScreen from './components/screens/GameScreen'
import WaitingScreen from './components/screens/WaitingScreen'
import WelcomeScreen from './components/screens/WelcomeScreen'
import { useEffect, useState } from 'react'
import { useGame } from './hooks/useGame'
import type { BoardType } from './types/game.types'

function App() {
    const {
        gameState,
        setGameState,
        loading,
        isRestoring,
        error,
        refreshGameState,
        createRoom,
        joinRoom,
        startGame,
        proposeNumber,
        confirmProposal,
        callBingo,
        resetGame,
        clearError,
        // hideProposalModal,
        // showProposalModal,
        strikeRow,
        strikeColumn,
    } = useGame()

    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null)

    useEffect(() => {
        if (error) {
            setToast({ message: error, type: 'error' })
            clearError()
        }
    }, [error, clearError])

    const handleCreateRoom = async (name: string, boardType: BoardType) => {
        try {
            const roomId = await createRoom(name, boardType)
            if (roomId) {
                setToast({ message: `Room created! ID: ${roomId}`, type: 'success' })
            }
        } catch (error) {
            console.error('error: ', error)
            if (error instanceof Error) {
                setToast({ message: error.message || 'Failed to create room', type: 'error' })
            }
        }
    }

    const handleRefreshGameState = async () => {
        try {
            const success = await refreshGameState()
            if (success) {
                setToast({ message: 'Game state refreshed successfully!', type: 'success' })
            }
        } catch (error) {
            console.error('error: ', error)
            if (error instanceof Error) {
                setToast({ message: error.message || 'Failed to refresh game state', type: 'error' })
            }
        }
    }

    const handleJoinRoom = async (roomId: string, name: string) => {
        try {
            const success = await joinRoom(roomId, name)
            if (success) {
                setToast({ message: 'Successfully joined room!', type: 'success' })
            }
        } catch (error) {
            console.error('error: ', error)
            if (error instanceof Error) {
                setToast({ message: error.message || 'Failed to join room', type: 'error' })
            }
        }
    }

    const handleStartGame = async () => {
        try {
            await startGame()
            setToast({ message: 'Game started!', type: 'success' })
        } catch (error) {
            console.error('error: ', error)
            if (error instanceof Error) {
                setToast({ message: error.message || 'Failed to start game', type: 'error' })
            }
        }
    }

    const handleProposeNumber = async (number: number) => {
        try {
            await proposeNumber(number)
        } catch (error) {
            console.error('error: ', error)
            if (error instanceof Error) {
                setToast({ message: error.message || 'Failed to propose number', type: 'error' })
            }
        }
    }

    const handleConfirmProposal = async () => {
        try {
            await confirmProposal()
        } catch (error) {
            console.error('error: ', error)
            if (error instanceof Error) {
                setToast({ message: error.message || 'Failed to confirm proposal', type: 'error' })
            }
        }
    }

    const handleCallBingo = async () => {
        try {
            await callBingo()
            setToast({ message: 'BINGO called!', type: 'success' })
        } catch (error) {
            console.error('error: ', error)
            if (error instanceof Error) {
                setToast({ message: error.message || 'Not a valid BINGO', type: 'error' })
            }
        }
    }

    const handlePlayAgain = () => {
        resetGame()
        setToast({ message: 'Starting new game...', type: 'info' })
    }

    const handleExitGame = () => {
        resetGame()
        setToast({ message: 'Left the game', type: 'info' })
    }

    const closeToast = () => {
        setToast(null)
    }

    const handleStrikeRow = async (rowIndex: number) => {
        try {
            await strikeRow(rowIndex)
            setToast({ message: `Row ${rowIndex + 1} struck!`, type: 'success' })
        } catch (error) {
            console.error('error: ', error)
            if (error instanceof Error) {
                setToast({ message: error.message || 'Failed to strike row', type: 'error' })
            }
        }
    }

    const handleStrikeColumn = async (colIndex: number) => {
        try {
            await strikeColumn(colIndex)
            setToast({ message: `Column ${colIndex + 1} struck!`, type: 'success' })
        } catch (error) {
            console.error('error: ', error)
            if (error instanceof Error) {
                setToast({ message: error.message || 'Failed to strike column', type: 'error' })
            }
        }
    }

    const renderScreen = () => {
        const { room } = gameState

        if (isRestoring) {
            return (
                <div className='min-h-screen flex items-center justify-center'>
                    <div className='text-center'>
                        <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500 mx-auto mb-4'></div>
                        <p className='text-lg font-medium text-gray-700'>Restoring your game...</p>
                        <p className='text-sm text-gray-500 mt-2'>Please wait while we reconnect you to your game</p>
                    </div>
                </div>
            )
        }

        if (!room) {
            return <WelcomeScreen onCreateRoom={handleCreateRoom} onJoinRoom={handleJoinRoom} loading={loading} />
        }

        if (!room.started) {
            return (
                <WaitingScreen
                    room={room}
                    currentPlayer={gameState.currentPlayer!}
                    onStartGame={handleStartGame}
                    onLeaveRoom={handleExitGame}
                    onRefreshState={handleRefreshGameState}
                    loading={loading}
                />
            )
        }

        return (
            <GameScreen
                gameState={gameState}
                setGameState={setGameState}
                onStrikeRow={handleStrikeRow}
                onStrikeColumn={handleStrikeColumn}
                onProposeNumber={handleProposeNumber}
                onConfirmProposal={handleConfirmProposal}
                onCallBingo={handleCallBingo}
                onPlayAgain={handlePlayAgain}
                onExitGame={handleExitGame}
                onRefreshState={handleRefreshGameState}
                loading={loading}
                // onHideProposalModal={hideProposalModal}
                // onShowProposalModal={showProposalModal}
            />
        )
    }
    return (
        <div className='App'>
            {renderScreen()}
            {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}
        </div>
    )
}

export default App
