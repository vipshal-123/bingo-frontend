interface GameSession {
    roomId: string
    playerId: string
    playerName: string
    boardType: string
    joinedAt: number
}

const GAME_SESSION_KEY = 'bingo_game_session'
const SESSION_EXPIRY_HOURS = 24

export const saveGameSession = (session: GameSession): void => {
    try {
        const sessionData = {
            ...session,
            joinedAt: Date.now(),
        }
        localStorage.setItem(GAME_SESSION_KEY, JSON.stringify(sessionData))
    } catch (error) {
        console.error('Failed to save game session:', error)
    }
}

export const getGameSession = (): GameSession | null => {
    try {
        const sessionStr = localStorage.getItem(GAME_SESSION_KEY)
        if (!sessionStr) return null

        const session: GameSession = JSON.parse(sessionStr)

        const sessionAge = Date.now() - session.joinedAt
        const maxAge = SESSION_EXPIRY_HOURS * 60 * 60 * 1000

        if (sessionAge > maxAge) {
            clearGameSession()
            return null
        }

        return session
    } catch (error) {
        console.error('Failed to get game session:', error)
        return null
    }
}

export const clearGameSession = (): void => {
    try {
        localStorage.removeItem(GAME_SESSION_KEY)
    } catch (error) {
        console.error('Failed to clear game session:', error)
    }
}

export const updateGameSession = (updates: Partial<GameSession>): void => {
    const currentSession = getGameSession()
    if (currentSession) {
        saveGameSession({ ...currentSession, ...updates })
    }
}

export const setLocal = (key: string, token: string) => {
    return localStorage.setItem(key, token)
}

export const getLocal = (key: string) => {
    return localStorage.getItem(key)
}

export const removeLocal = (key: string) => {
    return localStorage.removeItem(key)
}
