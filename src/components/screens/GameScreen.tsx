import React, { useEffect, useState } from 'react'
import { useGame } from '../../hooks/useGame'
import { isMyTurn } from '../../utils/game.utils'
import GameInfo from '../game/GameInfo'
import Button from '../common/Button'
import BingoBoard from '../game/BingoBoard'
import ProposalModal from '../game/ProposalModal'
import GameOverModal from '../game/GameOverModal'

interface GameScreenProps {
    gameState: ReturnType<typeof useGame>['gameState']
    onProposeNumber: (number: number) => void
    onConfirmProposal: () => void
    onCallBingo: () => void
    onPlayAgain: () => void
    onExitGame: () => void
    loading: boolean
    onStrikeRow: (rowIndex: number) => void
    onStrikeColumn: (colIndex: number) => void
}

const GameScreen: React.FC<GameScreenProps> = ({
    gameState,
    onProposeNumber,
    onConfirmProposal,
    // onCallBingo,
    onPlayAgain,
    onExitGame,
    loading,
    onStrikeRow,
    onStrikeColumn,
}) => {
    const { room, currentPlayer, pendingProposal, winner, gameStatus } = gameState

    const [isModalVisible, setIsModalVisible] = useState(true)

    const myTurn = isMyTurn(room, currentPlayer)
    // const canCallBingo = checkBingo(currentPlayer?.marked || [])
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

    return (
        <div className='min-h-screen p-4'>
            <div className='max-w-6xl mx-auto'>
                <GameInfo room={room} currentPlayer={currentPlayer} lastCalledNumber={gameState.lastCalledNumber} />

                <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
                    <div className='lg:col-span-3'>
                        <div className='bg-white rounded-xl shadow-lg p-4 sm:p-6 mt-16'>
                            {/* <div className='flex justify-between items-center mb-6'>
                                <h2 className='text-xl font-bold text-gray-800'>Your Board</h2>
                                {canCallBingo && (
                                    <Button variant='success' onClick={onCallBingo} loading={loading} className='animate-bounce-in'>
                                        🎉 CALL BINGO!
                                    </Button>
                                )}
                            </div> */}

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

                            <div className='mt-6 text-center'>
                                {pendingProposal && !isMyProposal ? (
                                    <div className='p-4 bg-orange-50 border border-orange-200 rounded-lg'>
                                        <p className='text-orange-800 font-medium'>
                                            🎯 Click number <strong>{pendingProposal.number}</strong> on your board to confirm it!
                                        </p>
                                        {!isModalVisible && (
                                            <p className='text-orange-600 text-sm mt-2'>
                                                💡 The notification was closed, but you can still confirm by clicking the highlighted number
                                            </p>
                                        )}
                                    </div>
                                ) : pendingProposal && isMyProposal ? (
                                    <div className='p-4 bg-blue-50 border border-blue-200 rounded-lg'>
                                        <p className='text-blue-800 font-medium'>
                                            ⏳ Waiting for opponent to confirm your proposed number <strong>{pendingProposal.number}</strong>...
                                        </p>
                                    </div>
                                ) : myTurn ? (
                                    <div className='p-4 bg-green-50 border border-green-200 rounded-lg'>
                                        <p className='text-green-800 font-medium'>🎯 It's your turn!</p>
                                    </div>
                                ) : (
                                    <div className='p-4 bg-blue-50 border border-blue-200 rounded-lg'>
                                        <p className='text-blue-800 font-medium'>⏳ Waiting for opponent's move...</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className='lg:col-span-1'>
                        {/* <PlayersList players={room.players} currentPlayerId={currentPlayer._id} currentTurn={room.turn} /> */}

                        <div className='bg-white rounded-xl shadow-lg p-4 sm:p-6'>
                            {/* <h3 className='text-lg font-bold text-gray-800 mb-4'>Actions</h3>
                            <div className='space-y-3'>
                                {pendingProposal && !isMyProposal && !isModalVisible && (
                                    <Button variant='secondary' onClick={() => setIsModalVisible(true)} className='w-full' size='sm'>
                                        Show Proposal
                                    </Button>
                                )}
                                
                            </div> */}
                            <Button variant='danger' onClick={onExitGame} size='sm'>
                                Exit Game
                            </Button>
                        </div>
                    </div>
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
        </div>
    )
}

export default GameScreen
