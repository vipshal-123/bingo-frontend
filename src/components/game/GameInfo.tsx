import React, { useState } from 'react'
import type { Player, Room } from '@/types/game.types'
import { formatRoomId, isMyTurn } from '@/utils/game.utils'

interface GameInfoProps {
    room: Room
    currentPlayer: Player
    lastCalledNumber: number | null
}

const GameInfo: React.FC<GameInfoProps> = ({ room, currentPlayer, lastCalledNumber }) => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const myTurn = isMyTurn(room, currentPlayer)
    const currentTurnPlayer = room.players.find((p) => p._id === room.turn)

    return (
        <>
            {/* Drawer Toggle Button */}
            <button
                onClick={() => setIsDrawerOpen(true)}
                className='fixed top-4 left-4 z-50 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-3 hover:bg-white transition-all duration-300 hover:scale-105 active:scale-95'
                aria-label='Open game info'
            >
                <div className='flex items-center gap-2'>
                    <div className={`w-3 h-3 rounded-full animate-pulse ${myTurn ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                    <div className='flex flex-col items-start'>
                        <span className='text-xs text-gray-600 font-medium'>Room {formatRoomId(room.roomId)}</span>
                        {lastCalledNumber && <span className='text-sm font-bold text-purple-600'>{lastCalledNumber}</span>}
                    </div>
                </div>
            </button>

            {/* Overlay */}
            {isDrawerOpen && (
                <div
                    className='fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300'
                    onClick={() => setIsDrawerOpen(false)}
                />
            )}

            {/* Drawer */}
            <div
                className={`fixed top-0 left-0 h-full w-80 sm:w-96 bg-white/95 backdrop-blur-lg shadow-2xl transform transition-transform duration-300 z-50 ${
                    isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className='p-4 sm:p-6 h-full overflow-y-auto'>
                    {/* Header */}
                    <div className='flex items-center justify-between mb-6'>
                        <h2 className='text-xl font-bold text-gray-800'>Game Info</h2>
                        <button
                            onClick={() => setIsDrawerOpen(false)}
                            className='w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors duration-200'
                            aria-label='Close drawer'
                        >
                            <span className='text-gray-600'>✕</span>
                        </button>
                    </div>

                    {/* Game Stats */}
                    <div className='space-y-4 mb-6'>
                        {/* Room ID */}
                        <div className='bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-4 border border-blue-200/50'>
                            <h3 className='text-sm text-blue-600 mb-2 font-medium uppercase tracking-wide'>Room ID</h3>
                            <p className='text-2xl font-bold text-blue-700 font-mono tracking-wider'>{formatRoomId(room.roomId)}</p>
                        </div>

                        {/* Current Turn */}
                        <div
                            className={`rounded-xl p-4 border transition-all duration-300 ${
                                myTurn
                                    ? 'bg-gradient-to-br from-green-50 to-emerald-100 border-green-200/50 shadow-lg'
                                    : 'bg-gradient-to-br from-orange-50 to-amber-100 border-orange-200/50'
                            }`}
                        >
                            <h3 className={`text-sm mb-2 font-medium uppercase tracking-wide ${myTurn ? 'text-green-600' : 'text-orange-600'}`}>
                                Current Turn
                            </h3>
                            <div className='flex items-center gap-3'>
                                <div className={`w-3 h-3 rounded-full animate-pulse ${myTurn ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                                <p className={`text-xl font-bold ${myTurn ? 'text-green-700' : 'text-orange-700'}`}>
                                    {myTurn ? 'Your Turn' : currentTurnPlayer?.name || 'Opponent'}
                                </p>
                            </div>
                        </div>

                        {/* Last Called Number */}
                        <div className='bg-gradient-to-br from-purple-50 to-violet-100 rounded-xl p-4 border border-purple-200/50'>
                            <h3 className='text-sm text-purple-600 mb-2 font-medium uppercase tracking-wide'>Last Called</h3>
                            <div className='flex items-center justify-center'>
                                {lastCalledNumber ? (
                                    <div className='bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg px-4 py-2 shadow-lg'>
                                        <p className='text-3xl font-bold'>{lastCalledNumber}</p>
                                    </div>
                                ) : (
                                    <p className='text-3xl font-bold text-purple-400'>-</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Game Progress */}
                    <div className='mb-6'>
                        <h3 className='text-sm text-gray-600 mb-3 font-medium uppercase tracking-wide'>Game Progress</h3>
                        <div className='bg-gray-200 rounded-full h-3'>
                            <div
                                className='bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500 shadow-sm'
                                style={{ width: `${Math.min((room.calledNumbers.length / 75) * 100, 100)}%` }}
                            ></div>
                        </div>
                        <p className='text-sm text-gray-500 text-center mt-2'>{room.calledNumbers.length}/75 numbers called</p>
                    </div>

                    {/* Called Numbers History */}
                    {room.calledNumbers.length > 0 && (
                        <div>
                            <h3 className='text-sm text-gray-600 mb-3 font-medium uppercase tracking-wide'>Called Numbers</h3>
                            <div className='max-h-60 overflow-y-auto bg-gray-50 rounded-xl p-3'>
                                <div className='flex flex-wrap gap-2'>
                                    {room.calledNumbers
                                        .slice()
                                        .reverse()
                                        .map((number, index) => (
                                            <span
                                                key={`${number}-${index}`}
                                                className={`px-3 py-1 text-sm rounded-lg font-medium transition-all duration-300 border ${
                                                    number === lastCalledNumber && index === 0
                                                        ? 'bg-gradient-to-br from-purple-500 to-purple-600 text-white border-purple-400 shadow-lg animate-pulse'
                                                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
                                                }`}
                                            >
                                                {number}
                                            </span>
                                        ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default GameInfo
