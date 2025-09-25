import React, { createContext, useContext, useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import config from '@/config'

interface ISocketContext {
    socket: Socket | null
}

const SocketContext = createContext<ISocketContext>({ socket: null })

export const useSocket = () => useContext(SocketContext)

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null)

    useEffect(() => {
        const s = io(config.SOCKET_URL)
        setSocket(s)

        return () => {
            s.disconnect()
        }
    }, [])

    return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>
}
