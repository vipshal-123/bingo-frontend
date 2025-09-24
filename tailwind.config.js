/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#f0f9ff',
                    500: '#3b82f6',
                    600: '#2563eb',
                    700: '#1d4ed8',
                },
                success: {
                    500: '#10b981',
                    600: '#059669',
                },
                danger: {
                    500: '#ef4444',
                    600: '#dc2626',
                },
                warning: {
                    500: '#f59e0b',
                    600: '#d97706',
                },
            },
            animation: {
                'bounce-in': 'bounceIn 0.6s ease-out',
                'fade-in': 'fadeIn 0.3s ease-in',
                'slide-up': 'slideUp 0.4s ease-out',
            },
            keyframes: {
                bounceIn: {
                    '0%': { transform: 'scale(0.3)', opacity: '0' },
                    '50%': { transform: 'scale(1.05)' },
                    '70%': { transform: 'scale(0.9)' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(100%)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
            },
        },
    },
    plugins: [],
    important: true,
}
