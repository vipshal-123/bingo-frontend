import React from 'react'
import Card from '../common/Card'
import Button from '../common/Button'
import type { Room, Player } from '@/types/game.types'
import { formatRoomId } from '@/utils/game.utils'

interface WaitingScreenProps {
    room: Room
    currentPlayer: Player
    onStartGame: () => void
    onLeaveRoom: () => void
    onRefreshState: () => Promise<void> 
    loading: boolean
}

const WaitingScreen: React.FC<WaitingScreenProps> = ({ room, currentPlayer, onStartGame, onLeaveRoom, loading }) => {
    console.log('room: ', room)
    const canStartGame = room?.players?.length >= 2
    const isRoomCreator = room.players[0]._id === currentPlayer._id

    return (
        <div className='min-h-screen flex items-center justify-center p-4'>
            <div className='w-full max-w-lg'>
                <Card>
                    <div className='text-center'>
                        <h1 className='text-3xl font-bold text-gray-800 mb-2'>Waiting Room</h1>
                        <p className='text-gray-600 mb-6'>Share the room ID with your friend</p>

                        <div className='bg-gray-50 rounded-lg p-4 mb-6'>
                            <div className='text-sm text-gray-500 mb-1'>Room ID</div>
                            <div className='text-2xl font-mono font-bold text-primary-600'>{formatRoomId(room.roomId)}</div>
                            <div className='text-sm text-gray-500 mt-1'>Board Type: {room.boardType}</div>
                        </div>

                        <div className='mb-6'>
                            <h3 className='text-lg font-semibold text-gray-800 mb-3'>Players ({room.players.length}/2)</h3>
                            <div className='space-y-2'>
                                {room.players.map((player, index) => (
                                    <div
                                        key={player._id}
                                        className={`flex items-center justify-between p-3 rounded-lg ${
                                            player._id === currentPlayer._id ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                                        }`}
                                    >
                                        <div className='flex items-center'>
                                            <div className='w-2 h-2 bg-green-500 rounded-full mr-3'></div>
                                            <span className='font-medium'>
                                                {player.name}
                                                {player._id === currentPlayer._id && ' (You)'}
                                                {index === 0 && ' 👑'}
                                            </span>
                                        </div>
                                    </div>
                                ))}

                                {room.players.length < 2 && (
                                    <div className='flex items-center justify-between p-3 rounded-lg bg-gray-100 border-2 border-dashed border-gray-300'>
                                        <div className='flex items-center'>
                                            <div className='w-2 h-2 bg-gray-400 rounded-full mr-3'></div>
                                            <span className='text-gray-500'>Waiting for player...</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className='space-y-3'>
                            {isRoomCreator && (
                                <Button onClick={onStartGame} className='w-full' loading={loading} disabled={!canStartGame || loading}>
                                    {canStartGame ? 'Start Game' : 'Waiting for Players...'}
                                </Button>
                            )}

                            {!isRoomCreator && !canStartGame && (
                                <div className='p-4 bg-yellow-50 border border-yellow-200 rounded-lg'>
                                    <p className='text-yellow-800 text-sm'>🕐 Waiting for the room creator to start the game...</p>
                                </div>
                            )}

                            <Button variant='secondary' onClick={onLeaveRoom} className='w-full'>
                                Leave Room
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default WaitingScreen
