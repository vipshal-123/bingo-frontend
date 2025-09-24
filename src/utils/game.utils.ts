import type { BoardType, Player } from '@/types/game.types'

export const checkBingo = (marked: boolean[][]): boolean => {
    const size = marked.length

    for (let i = 0; i < size; i++) {
        if (marked[i].every((cell) => cell)) return true
    }

    for (let j = 0; j < marked[0].length; j++) {
        if (marked.every((row) => row[j])) return true
    }

    if (marked.length === marked[0].length) {
        if (marked.every((row, i) => row[i])) return true

        if (marked.every((row, i) => row[size - 1 - i])) return true
    }

    return false
}

export const getBingoProgress = (marked: boolean[][]): { completedLines: number; bingoLetters: string[] } => {
    const size = marked.length
    let completedLines = 0
    const bingoLetters: string[] = []

    for (let i = 0; i < size; i++) {
        if (marked[i].every((cell) => cell)) {
            completedLines++
            if (i < 5) bingoLetters.push(['B', 'I', 'N', 'G', 'O'][i])
        }
    }

    return { completedLines, bingoLetters }
}

export const formatRoomId = (roomId: string): string => {
    return roomId
}

export const getPlayerName = (player: Player | null, fallback = 'Unknown'): string => {
    return player?.name || fallback
}

export const isMyTurn = (room: any, currentPlayer: Player | null): boolean => {
    if (!room || !currentPlayer) return false
    return room.turn === currentPlayer._id
}

export const checkCompleteRow = (marked: boolean[][], rowIndex: number): boolean => {
    if (!marked || !marked[rowIndex]) return false
    return marked[rowIndex].every((cell) => cell === true)
}

export const checkCompleteColumn = (marked: boolean[][], colIndex: number): boolean => {
    if (!marked || marked.length === 0) return false
    return marked.every((row) => row[colIndex] === true)
}

export const getCompletableRows = (marked: boolean[][], strikes: { rows: boolean[] }): number[] => {
    console.log('strikes: ', strikes)

    const completableRows: number[] = []

    for (let rowIndex = 0; rowIndex < marked.length; rowIndex++) {
        if (!strikes.rows[rowIndex] && checkCompleteRow(marked, rowIndex)) {
            completableRows.push(rowIndex)
        }
    }

    return completableRows
}

export const getCompletableColumns = (marked: boolean[][], strikes: { columns: boolean[] }, boardType: BoardType): number[] => {
    const completableColumns: number[] = []
    const columnCount = boardType === '5x5' ? 5 : 10

    for (let colIndex = 0; colIndex < columnCount; colIndex++) {
        if (!strikes.columns[colIndex] && checkCompleteColumn(marked, colIndex)) {
            completableColumns.push(colIndex)
        }
    }

    return completableColumns
}

export const checkBingoWithStrikes = (marked: boolean[][], strikes: { rows: boolean[]; columns: boolean[] }, boardType: BoardType): boolean => {
    const size = boardType === '5x5' ? 5 : 10

    const completedRows = strikes.rows.filter(Boolean).length + marked.filter((row, idx) => !strikes.rows[idx] && row.every(Boolean)).length

    if (completedRows >= 5) return true

    let completedColumns = strikes.columns.filter(Boolean).length

    for (let col = 0; col < size; col++) {
        if (!strikes.columns[col]) {
            const isColumnComplete = marked.every((row) => row[col] === true)
            if (isColumnComplete) completedColumns++
        }
    }

    if (completedColumns >= 5) return true

    if (boardType === '5x5') {
        let mainDiagonalComplete = true
        let antiDiagonalComplete = true

        for (let i = 0; i < 5; i++) {
            if (!marked[i][i]) mainDiagonalComplete = false
            if (!marked[i][4 - i]) antiDiagonalComplete = false
        }

        if (mainDiagonalComplete || antiDiagonalComplete) return true
    }

    return false
}
