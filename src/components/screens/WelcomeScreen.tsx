import React, { useState } from 'react'
import type { BoardType } from '@/types/game.types'
import Card from '../common/Card'
import Input from '../common/Input'
import Button from '../common/Button'

interface WelcomeScreenProps {
    onCreateRoom: (name: string, boardType: BoardType) => Promise<void>
    onJoinRoom: (roomId: string, name: string) => Promise<void>
    loading: boolean
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onCreateRoom, onJoinRoom, loading }) => {
    const [activeTab, setActiveTab] = useState<'create' | 'join'>('create')
    const [formData, setFormData] = useState({
        name: '',
        roomId: '',
        boardType: '5x5' as BoardType,
    })
    const [errors, setErrors] = useState<Record<string, string>>({})

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required'
        } else if (formData.name.trim().length < 2) {
            newErrors.name = 'Name must be at least 2 characters'
        }

        if (activeTab === 'join' && !formData.roomId.trim()) {
            newErrors.roomId = 'Room ID is required'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) return

        try {
            if (activeTab === 'create') {
                await onCreateRoom(formData.name.trim(), formData.boardType)
            } else {
                await onJoinRoom(formData.roomId, formData.name.trim())
            }
        } catch (error) {
            console.log('error: ', error)
        }
    }

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: '' }))
        }
    }

    return (
        <div className='min-h-screen flex items-center justify-center p-4'>
            <div className='w-full max-w-md'>
                <div className='text-center mb-8'>
                    <h1 className='text-4xl font-bold text-gray-800 mb-2'>🎲 BINGO</h1>
                    <p className='text-gray-600'>Play BINGO with friends online!</p>
                </div>

                <Card>
                    <div className='flex mb-6'>
                        <button
                            onClick={() => setActiveTab('create')}
                            className={`flex-1 py-3 px-4 text-center font-medium rounded-l-lg border-2 transition-colors ${
                                activeTab === 'create'
                                    ? 'bg-primary-500 text-white border-primary-500'
                                    : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                            }`}
                        >
                            Create Room
                        </button>
                        <button
                            onClick={() => setActiveTab('join')}
                            className={`flex-1 py-3 px-4 text-center font-medium rounded-r-lg border-2 border-l-0 transition-colors ${
                                activeTab === 'join'
                                    ? 'bg-primary-500 text-white border-primary-500'
                                    : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                            }`}
                        >
                            Join Room
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <Input
                            label='Your Name'
                            type='text'
                            placeholder='Enter your name'
                            value={formData.name}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('name', e.target.value)}
                            error={errors.name}
                            maxLength={20}
                        />

                        {activeTab === 'create' ? (
                            <div className='mb-6'>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>Board Type</label>
                                <div className='grid grid-cols-2 gap-3'>
                                    <button
                                        type='button'
                                        onClick={() => handleInputChange('boardType', '5x5')}
                                        className={`p-4 border-2 rounded-lg transition-colors ${
                                            formData.boardType === '5x5'
                                                ? 'border-primary-500 bg-primary-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        <div className='text-center'>
                                            <div className='text-lg font-bold'>5×5</div>
                                            <div className='text-sm text-gray-600'>1-25 numbers</div>
                                        </div>
                                    </button>
                                    <button
                                        type='button'
                                        onClick={() => handleInputChange('boardType', '5x10')}
                                        className={`p-4 border-2 rounded-lg transition-colors ${
                                            formData.boardType === '5x10'
                                                ? 'border-primary-500 bg-primary-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        <div className='text-center'>
                                            <div className='text-lg font-bold'>5×10</div>
                                            <div className='text-sm text-gray-600'>1-50 numbers</div>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <Input
                                label='Room ID'
                                type='text'
                                placeholder='Enter room ID'
                                value={formData.roomId}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('roomId', e.target.value)}
                                error={errors.roomId}
                                maxLength={8}
                            />
                        )}

                        <Button type='submit' className='w-full' loading={loading} disabled={loading}>
                            {activeTab === 'create' ? 'Create Room' : 'Join Room'}
                        </Button>
                    </form>
                </Card>
            </div>
        </div>
    )
}

export default WelcomeScreen
