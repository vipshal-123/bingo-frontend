import axios from './axiosService'
import isEmpty from 'is-empty'

export const handleResponse = (response: any, type: string) => {
    try {
        if (type === 'success') {
            return response.data
        } else if (type === 'error') {
            if (isEmpty(response.response) || isEmpty(response.response.data)) {
                return { success: false, message: 'Unknown error occurred' }
            }

            return response.response.data
        }
    } catch (error) {
        console.log('error: ', error)
        return { success: false, message: 'Unknown error occurred' }
    }
}

export default axios
