import axios, { handleResponse } from '../axios'

export const createRoomApi = async (data: { boardType: string; name: string }) => {
    try {
        const response = await axios({
            url: '/v1/bingo/create-room',
            method: 'POST',
            data,
        })

        return handleResponse(response, 'success')
    } catch (error) {
        return handleResponse(error, 'error')
    }
}

export const joinRoomApi = async (data: { roomId: string; name: string }) => {
    try {
        const response = await axios({
            url: '/v1/bingo/join-room',
            method: 'POST',
            data,
        })

        return handleResponse(response, 'success')
    } catch (error) {
        return handleResponse(error, 'error')
    }
}

export const startGameApi = async (data: { roomId: string }) => {
    try {
        const response = await axios({
            url: '/v1/bingo/start-game',
            method: 'POST',
            data,
        })

        return handleResponse(response, 'success')
    } catch (error) {
        return handleResponse(error, 'error')
    }
}

export const getPlayers = async (roomId: string) => {
    try {
        const response = await axios({
            url: `/v1/bingo/players/${roomId}`,
            method: 'GET',
        })

        return handleResponse(response, 'success')
    } catch (error) {
        return handleResponse(error, 'error')
    }
}

export const proposeNumberApi = async (data: { roomId: string; playerId: string; number: number }) => {
    try {
        const response = await axios({
            url: '/v1/bingo/propose-number',
            method: 'POST',
            data,
        })

        return handleResponse(response, 'success')
    } catch (error) {
        return handleResponse(error, 'error')
    }
}

export const confirmProposalApi = async (data: { roomId: string; playerId: string }) => {
    try {
        const response = await axios({
            url: '/v1/bingo/confirm-proposal',
            method: 'POST',
            data,
        })

        return handleResponse(response, 'success')
    } catch (error) {
        return handleResponse(error, 'error')
    }
}

export const callBingoApi = async (data: { roomId: string; playerId: string }) => {
    try {
        const response = await axios({
            url: '/v1/bingo/call-bingo',
            method: 'POST',
            data,
        })

        return handleResponse(response, 'success')
    } catch (error) {
        return handleResponse(error, 'error')
    }
}

export const strikeApi = async (data: { roomId: string; playerId: string; type: string; index: number }) => {
    try {
        const response = await axios({
            url: '/v1/bingo/strike',
            method: 'POST',
            data,
        })
        return handleResponse(response, 'success')
    } catch (error) {
        return handleResponse(error, 'error')
    }
}

export const getRoomStateApi = async (roomId: string, playerId?: string) => {
    try {
        const response = await axios({
            url: `/v1/bingo/room/${roomId}/state`,
            method: 'GET',
            params: { playerId },
        })

        return handleResponse(response, 'success')
    } catch (error) {
        return handleResponse(error, 'error')
    }
}

export const getRoomInfoApi = async (roomId: string) => {
    try {
        const response = await axios({
            url: `/v1/bingo/room/${roomId}/info`,
            method: 'GET',
        })

        return handleResponse(response, 'success')
    } catch (error) {
        return handleResponse(error, 'error')
    }
}
