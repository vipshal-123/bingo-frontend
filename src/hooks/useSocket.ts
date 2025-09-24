import { socketService } from '@/services/v1/socket.service'
import { useEffect, useCallback } from 'react'

export const useSocket = () => {
    const connect = useCallback(async () => {
        try {
            await socketService.connect()
            return true
        } catch (error) {
            console.error('Failed to connect to socket:', error)
            return false
        }
    }, [])

    const disconnect = useCallback(() => {
        socketService.disconnect()
    }, [])

    useEffect(() => {
        return () => {
            socketService.disconnect()
        }
    }, [])

    return {
        connect,
        disconnect,
        socket: socketService,
        isConnected: socketService.isConnected(),
    }
}
