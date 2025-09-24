import React from 'react'

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title: string
    children: React.ReactNode
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null

    return (
        <div className='fixed inset-0 z-50 overflow-y-auto'>
            <div className='flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0'>
                <div className='fixed inset-0 transition-opacity' onClick={onClose}>
                    <div className='absolute inset-0 bg-gray-500 opacity-75'></div>
                </div>

                <div className='inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6 animate-slide-up'>
                    <div>
                        <h3 className='text-lg leading-6 font-medium text-gray-900 mb-4'>{title}</h3>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Modal
