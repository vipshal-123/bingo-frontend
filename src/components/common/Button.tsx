import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'success' | 'danger'
    size?: 'sm' | 'md' | 'lg'
    loading?: boolean
    children: React.ReactNode
}

const Button: React.FC<ButtonProps> = ({ variant = 'primary', size = 'md', loading = false, disabled, children, className = '', ...props }) => {
    const baseClasses =
        'font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'

    const variantClasses = {
        primary: 'bg-primary-500 hover:bg-primary-600 text-white',
        secondary: 'bg-gray-500 hover:bg-gray-600 text-white',
        success: 'bg-success-500 hover:bg-success-600 text-white',
        danger: 'bg-danger-500 hover:bg-danger-600 text-white',
    }

    const sizeClasses = {
        sm: 'py-2 px-4 text-sm',
        md: 'py-3 px-6',
        lg: 'py-4 px-8 text-lg',
    }

    return (
        <button className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`} disabled={disabled || loading} {...props}>
            {loading ? (
                <div className='flex items-center justify-center'>
                    <svg className='animate-spin -ml-1 mr-3 h-5 w-5 text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                        <path
                            className='opacity-75'
                            fill='currentColor'
                            d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                        ></path>
                    </svg>
                    Loading...
                </div>
            ) : (
                children
            )}
        </button>
    )
}

export default Button
