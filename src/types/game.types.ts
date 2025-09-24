export type BoardType = '5x5' | '5x10'

export type BingoWord = {
    B: boolean
    I: boolean
    N: boolean
    G: boolean
    O: boolean
}

export interface Player {
    _id: string
    name: string
    boardType: BoardType
    board: number[][]
    marked: boolean[][]
    strikes: {
        rows: boolean[]
        columns: boolean[]
    }
    bingoWord: BingoWord
}

export interface PendingProposal {
    number: number
    by: string
    timestamp?: number
}

export interface Room {
    _id: string
    roomId: string
    boardType: BoardType
    players: Player[]
    turn: string
    calledNumbers: number[]
    started: boolean
    pendingNumber?: number | null
    pendingBy?: string | null
}

export interface GameState {
    room: Room | null
    currentPlayer: Player | null
    isConnected: boolean
    gameStatus: 'waiting' | 'playing' | 'finished'
    winner: string | null
    lastCalledNumber: number | null
    isProposalModalVisible: boolean
    pendingProposal: {
        number: number
        by: string
    } | null
}

export interface ApiResponse<T = any> {
    success: boolean
    message: string
    data?: T
    winner?: boolean
}

import { Socket } from 'socket.io-client'

export interface Player {
    _id: string
    name: string
    boardType: BoardType
    board: number[][]
    marked: boolean[][]
}

export interface Room {
    roomId: string
    boardType: BoardType
    players: Player[]
    turn: string
    calledNumbers: number[]
    started: boolean
}

export type UseGameReturn = {
    loading: boolean
    room: Room | null
    players: Player[]
    board: number[][]
    marked: boolean[][]
    turn: string | null
    calledNumbers: number[]
    started: boolean
    joinRoom: (roomId: string, name: string, boardType: string) => void
    createRoom: (name: string, boardType: string) => void
    leaveRoom: (roomId: string) => void
    makeMove: (row: number, col: number) => void
    socket: Socket | null
}
