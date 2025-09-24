import React from 'react'
import Modal from '../common/Modal'
import Button from '../common/Button'

interface GameOverModalProps {
    isOpen: boolean
    isWinner: boolean
    winnerName: string
    onPlayAgain: () => void
    onExit: () => void
}

const GameOverModal: React.FC<GameOverModalProps> = ({ isOpen, isWinner, winnerName, onPlayAgain, onExit }) => {
    return (
        <Modal isOpen={isOpen} onClose={() => {}} title='Game Over'>
            <div className='text-center'>
                <div className={`mx-auto flex items-center justify-center h-20 w-20 rounded-full mb-4 ${isWinner ? 'bg-green-100' : 'bg-gray-100'}`}>
                    <span className='text-4xl'>{isWinner ? '🎉' : '😔'}</span>
                </div>

                <h2 className={`text-2xl font-bold mb-2 ${isWinner ? 'text-green-600' : 'text-gray-600'}`}>
                    {isWinner ? 'Congratulations!' : 'Game Over'}
                </h2>

                <p className='text-lg text-gray-700 mb-6'>{isWinner ? 'You won the game! 🎊' : `${winnerName} won the game!`}</p>

                <div className='flex gap-3 justify-center'>
                    <Button variant='secondary' onClick={onExit}>
                        Exit Game
                    </Button>
                    <Button variant='primary' onClick={onPlayAgain}>
                        Play Again
                    </Button>
                </div>
            </div>
        </Modal>
    )
}

export default GameOverModal
