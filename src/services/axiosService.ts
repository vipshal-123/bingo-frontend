import axios from 'axios'
import { getLocal } from '../utils/storage'
import config from '@/config'
import paramsEncoder from '@/utils/paramsEncoder'

const UserService = axios.create({
    baseURL: config.API_URL,
    withCredentials: true,
    paramsSerializer: paramsEncoder,
})

UserService.interceptors.request.use(
    (requestConfig) => {
        const token = getLocal('access_token')

        if (token && requestConfig.url && !requestConfig.url.endsWith('refresh-token')) {
            requestConfig.headers = {
                ...requestConfig.headers,
                Authorization: `Bearer ${token}`,
            }
        } else {
            requestConfig.headers = {
                ...requestConfig.headers,
                Authorization: '',
            }
        }

        requestConfig.headers = {
            ...requestConfig.headers,
            TIMESTAMP: new Date().toISOString(),
            TIMEZONE: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }

        return requestConfig
    },
    (error) => Promise.reject(error),
)

export default UserService
