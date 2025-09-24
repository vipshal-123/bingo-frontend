import React, { useEffect } from 'react'
import Modal from '../common/Modal'

interface ProposalModalProps {
    isOpen: boolean
    number: number
    proposerName: string
    onAutoClose: () => void
}

const ProposalModal: React.FC<ProposalModalProps> = ({ isOpen, number, proposerName, onAutoClose }) => {
    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                onAutoClose()
            }, 3000)

            return () => clearTimeout(timer)
        }
    }, [isOpen, onAutoClose])

    return (
        <Modal isOpen={isOpen} onClose={onAutoClose} title='Number Proposed'>
            <div className='text-center'>
                <p className='text-lg text-gray-900 mb-2'>
                    <span className='font-semibold'>{proposerName}</span> has proposed
                </p>
                <div className='mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4'>
                    <span className='text-2xl font-bold text-blue-600'>{number}</span>
                </div>

                <p className='text-sm text-gray-600 mb-4'>Click the number on your board to confirm it</p>

                <div className='w-full bg-gray-200 rounded-full h-1 mb-2'>
                    <div className='bg-blue-600 h-1 rounded-full animate-shrink-width'></div>
                </div>
                <p className='text-xs text-gray-500'>This will close automatically in 5 seconds</p>
            </div>
        </Modal>
    )
}

export default ProposalModal
