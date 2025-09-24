import React, { useEffect, useState } from 'react'
import { isMyTurn } from '../../utils/game.utils'
import GameInfo from '../game/GameInfo'
import BingoBoard from '../game/BingoBoard'
import ProposalModal from '../game/ProposalModal'
import GameOverModal from '../game/GameOverModal'
import Button from '../common/Button'
import type { GameState } from '@/types/game.types'

interface GameScreenProps {
    gameState: GameState
    setGameState: React.Dispatch<React.SetStateAction<GameState>>
    onProposeNumber: (number: number) => void
    onConfirmProposal: () => void
    onCallBingo: () => void
    onPlayAgain: () => void
    onExitGame: () => void
    loading: boolean
    onStrikeRow: (rowIndex: number) => void
    onStrikeColumn: (colIndex: number) => void
    onRefreshState: () => Promise<void>
}

const GameScreen: React.FC<GameScreenProps> = ({
    gameState,
    onProposeNumber,
    onConfirmProposal,
    onPlayAgain,
    onExitGame,
    loading,
    onStrikeRow,
    onStrikeColumn,
}) => {
    const { room, currentPlayer, pendingProposal, winner, gameStatus } = gameState

    const [isModalVisible, setIsModalVisible] = useState(true)

    const myTurn = isMyTurn(room, currentPlayer)
    const isGameFinished = gameStatus === 'finished'
    const isWinner = winner === currentPlayer?._id
    const winnerPlayer = room?.players.find((p) => p._id === winner)

    const isMyProposal = pendingProposal?.by === currentPlayer?._id
    const shouldShowProposalModal = pendingProposal && !isMyProposal && isModalVisible

    useEffect(() => {
        if (pendingProposal && !isMyProposal) {
            setIsModalVisible(true)
        }
    }, [pendingProposal?.number, pendingProposal?.by, isMyProposal, pendingProposal])

    if (!room || !currentPlayer) return null

    const handleProposalAutoClose = () => {
        setIsModalVisible(false)
        console.log('Proposal modal auto-closed - proposal remains active')
    }

    const StatusMessage: React.FC<{ icon: string; children: React.ReactNode; variant: 'info' | 'success' | 'warning' }> = ({
        icon,
        children,
        variant,
    }) => {
        const colors = {
            info: 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 text-blue-800',
            success: 'bg-gradient-to-r from-green-50 to-green-100 border-green-200 text-green-800',
            warning: 'bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200 text-amber-800',
        }
        return (
            <div className={`flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl border-2 ${colors[variant]} backdrop-blur-sm`}>
                <span className='text-lg sm:text-xl animate-pulse'>{icon}</span>
                <p className='font-medium text-xs sm:text-sm md:text-base leading-tight'>{children}</p>
            </div>
        )
    }

    return (
        <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-2 sm:p-4 lg:p-6'>
            <GameInfo room={room} currentPlayer={currentPlayer} lastCalledNumber={gameState.lastCalledNumber} />

            <div className='max-w-6xl mx-auto space-y-3 sm:space-y-4 lg:space-y-6 mt-3 pt-16 sm:pt-4'>
                <div className='flex flex-col items-center space-y-4'>
                    <div className='w-full max-w-sm sm:max-w-md lg:max-w-lg'>
                        <div className='flex items-center justify-between mb-3 sm:mb-4'>
                            <h2 className='text-lg sm:text-xl lg:text-2xl font-bold text-slate-800'>Your Board</h2>
                            <div className='flex items-center gap-2 text-xs sm:text-sm text-slate-600'>
                                <div className='w-3 h-3 bg-emerald-500 rounded-full'></div>
                                <span>Marked</span>
                                <div className='w-3 h-3 bg-amber-400 rounded-full'></div>
                                <span>Confirm</span>
                            </div>
                        </div>

                        <BingoBoard
                            player={currentPlayer}
                            calledNumbers={room.calledNumbers}
                            onNumberClick={onProposeNumber}
                            onStrikeRow={onStrikeRow}
                            onStrikeColumn={onStrikeColumn}
                            onConfirmProposal={onConfirmProposal}
                            pendingProposal={pendingProposal}
                            isMyTurn={myTurn}
                            isMyProposal={isMyProposal}
                            disabled={loading}
                        />
                    </div>

                    <div className='w-full max-w-sm sm:max-w-md lg:max-w-lg'>
                        {pendingProposal && !isMyProposal ? (
                            <StatusMessage icon='👉' variant='warning'>
                                Your opponent proposed <strong>{pendingProposal.number}</strong>. Tap it on your board to confirm!
                            </StatusMessage>
                        ) : pendingProposal && isMyProposal ? (
                            <StatusMessage icon='⏳' variant='info'>
                                Waiting for opponent to confirm <strong>{pendingProposal.number}</strong>...
                            </StatusMessage>
                        ) : myTurn ? (
                            <StatusMessage icon='🎯' variant='success'>
                                Your turn! Tap any available number on your board.
                            </StatusMessage>
                        ) : (
                            <StatusMessage icon='⏳' variant='info'>
                                Waiting for opponent's move...
                            </StatusMessage>
                        )}
                    </div>
                </div>
                <Button variant='danger' onClick={onExitGame}>
                    Exit Game
                </Button>
            </div>

            {shouldShowProposalModal && (
                <ProposalModal
                    isOpen={true}
                    number={pendingProposal.number}
                    proposerName={room.players.find((p) => p._id === pendingProposal.by)?.name || 'Opponent'}
                    onAutoClose={handleProposalAutoClose}
                />
            )}

            <GameOverModal
                isOpen={isGameFinished}
                isWinner={isWinner}
                winnerName={winnerPlayer?.name || 'Unknown'}
                onPlayAgain={onPlayAgain}
                onExit={onExitGame}
            />
        </div>
    )
}

export default GameScreen
