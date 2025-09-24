import config from '@/config'
import { getLocal } from '@/utils/storage'
import isEmpty from 'is-empty'
import { io, Socket } from 'socket.io-client'

export interface SocketEvents {
    // Emitted events
    'joinRoom': (data: { roomId: string }) => void
    'leave-room': (roomId: string) => void
    'disconnect': () => void
    'createRoom': (data: { roomId: string }) => void

    // Listened events
    'playerJoined': (data: { players: any[] }) => void
    'gameStarted': (data: { calledNumbers: number[]; turn: string; players: any[] }) => void
    'opponentProposed': (data: { number: number; by: string }) => void
    'proposalConfirmed': (data: { number: number; by: string; calledNumbers: number[]; turn: string; players: any[] }) => void
    'gameOver': (data: { winner: string }) => void
    'playerDisconnected': (data: { playerId: string }) => void
    'playerStruck': (data: { playerId: string; strikeType: string; strikeIndex: number; struckBingoLetter: string }) => void
    'roomClosed': () => void
}

class SocketService {
    private socket: Socket | null = null
    private currentRoom: string | null = null
    private beforeUnloadBound = false

    connect(): Promise<Socket> {
        return new Promise((resolve, reject) => {
            if (this.socket?.connected) {
                resolve(this.socket)
                return
            }

            this.socket = io(config.SOCKET_URL, {
                transports: ['websocket'],
                timeout: 10000,
            })

            this.socket.on('connect', () => {
                console.log('Connected to server:', this.socket?.id)

                if (!this.beforeUnloadBound) {
                    window.addEventListener('beforeunload', () => {
                        if (this.currentRoom && this.socket?.connected) {
                            this.leaveRoom(this.currentRoom)
                        }
                    })
                    this.beforeUnloadBound = true
                }
                resolve(this.socket!)
            })

            this.socket.on('connect_error', (error) => {
                console.error('Socket connection error:', error)
                reject(error)
            })

            this.socket.on('disconnect', (reason) => {
                console.log('Disconnected from server:', reason)
            })
        })
    }

    disconnect(): void {
        if (this.currentRoom) {
            this.leaveRoom(this.currentRoom)
        }
        this.socket?.disconnect()
        this.socket = null
    }

    createRoom(roomId: string): void {
        this.socket?.emit('createRoom', { roomId }, (response: { ok: boolean; roomId?: string; error?: string }) => {
            if (response.ok) {
                console.log('Room created:', response.roomId)
            } else {
                console.error('Failed:', response.error)
            }
        })
    }

    joinRoom(roomId: string): void {
        const localData = JSON.parse(getLocal('bingo_game_session') as string)
        let currentRoomId = roomId
        if (!isEmpty(localData?.roomId)) {
            currentRoomId = localData?.roomId
        }

        this.currentRoom = currentRoomId
        this.socket?.emit('joinRoom', { roomId: currentRoomId }, (response: { ok: boolean; roomId?: string; error?: string }) => {
            if (response.ok) {
                console.log('Room joined:', response.roomId)
            } else {
                console.error('Failed:', response)
            }
        })
    }

    leaveRoom(roomId: string): void {
        this.socket?.emit('leave-room', roomId)
        this.currentRoom = null
    }

    on<K extends keyof SocketEvents>(event: K, callback: SocketEvents[K]): void {
        this.socket?.on(event, callback as any)
    }

    off<K extends keyof SocketEvents>(event: K, callback?: SocketEvents[K]): void {
        if (callback) {
            this.socket?.off(event, callback as any)
        } else {
            this.socket?.off(event)
        }
    }

    isConnected(): boolean {
        return this.socket?.connected ?? false
    }
}

export const socketService = new SocketService()
