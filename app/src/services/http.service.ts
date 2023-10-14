"use server"
import axios from 'axios'
import { cookies } from 'next/headers'
import authConfig from '@/configs/auth'

const instance = axios.create({
    baseURL: 'http://localhost:5000/api/v1', // local
    // baseURL: 'http://165.22.64.183/api/v1', // live
    timeout: 500000,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
})

// const accessToken = cookies().get('access_token')

instance.interceptors.request.use(function (config: any) {

    // const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)
    const storedToken = cookies().get('accessToken')?.value

    return {
        ...config,
        headers: {
            authorization: storedToken ? `Bearer ${storedToken}` : null
        }
    }
})

export default instance