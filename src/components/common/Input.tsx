import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
}

const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
    return (
        <div className='mb-4'>
            {label && <label className='block text-sm font-medium text-gray-700 mb-2'>{label}</label>}
            <input className={`input-field ${error ? 'border-red-500 focus:ring-red-500' : ''} ${className}`} {...props} />
            {error && <p className='mt-1 text-sm text-red-600'>{error}</p>}
        </div>
    )
}

export default Input
