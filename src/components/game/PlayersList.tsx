import React from 'react'
import type { Player } from '@/types/game.types'

interface PlayersListProps {
    players: Player[]
    currentPlayerId: string
    currentTurn: string
}

const PlayersList: React.FC<PlayersListProps> = ({ players, currentPlayerId, currentTurn }) => {
    return (
        <div className='bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6'>
            <h3 className='text-lg font-bold text-gray-800 mb-4'>Players</h3>
            <div className='space-y-3'>
                {players.map((player) => (
                    <div
                        key={player._id}
                        className={`flex items-center justify-between p-3 rounded-lg ${
                            player._id === currentPlayerId ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                        }`}
                    >
                        <div className='flex items-center'>
                            <div
                                className={`w-3 h-3 rounded-full mr-3 ${player._id === currentTurn ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}
                            ></div>
                            <span className={`font-medium ${player._id === currentPlayerId ? 'text-blue-800' : 'text-gray-700'}`}>
                                {player.name}
                                {player._id === currentPlayerId && ' (You)'}
                            </span>
                        </div>
                        <div className='text-sm text-gray-500'>{player.boardType}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default PlayersList
