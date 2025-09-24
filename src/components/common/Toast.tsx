import React, { useEffect } from 'react'

interface ToastProps {
    message: string
    type?: 'success' | 'error' | 'info' | 'warning'
    onClose: () => void
    duration?: number
}

const Toast: React.FC<ToastProps> = ({ message, type = 'info', onClose, duration = 5000 }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, duration)
        return () => clearTimeout(timer)
    }, [onClose, duration])

    const typeStyles = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500',
        warning: 'bg-yellow-500',
    }

    return (
        <div className={`fixed top-4 right-4 z-50 ${typeStyles[type]} text-white px-6 py-3 rounded-lg shadow-lg animate-slide-up`}>
            <div className='flex items-center justify-between'>
                <span>{message}</span>
                <button onClick={onClose} className='ml-4 text-white hover:text-gray-200'>
                    ×
                </button>
            </div>
        </div>
    )
}

export default Toast
