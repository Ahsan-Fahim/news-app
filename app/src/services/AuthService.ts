import axios, { AxiosResponse } from 'axios'
import requests from './http.service'
import { IUser } from '@/types/apps/user'
import { ForgotPasswordParams, ResetPasswordParams } from '@/context/types'

const AuthServices = {

    login(body: any): Promise<AxiosResponse<any, any>> {
        return requests.post(`/auth/signin`, body)
    },

    async signup(body: any): Promise<AxiosResponse<any, any>> {
        return requests.post(`/auth/signup`, body)
    },

    profileUpdate(id: string, body: IUser): Promise<AxiosResponse<any, any>> {
        return requests.put(`/auth/users/${id}`, body)
    },

    changePassword(body: IUser): Promise<AxiosResponse<any, any>> {
        return requests.put(`/auth/change/password`, body)
    },

    me(): Promise<AxiosResponse<any, any>> {
        return requests.get(`/auth/me`)
    },

    forgotPassword(body: ForgotPasswordParams): Promise<AxiosResponse<any, any>> {
        return requests.post(`/auth/forgot-password`, body);
    },

    resetPassword(body: ResetPasswordParams, token: string): Promise<AxiosResponse<any, any>> {
        return requests.post(`/auth/reset-password?token=${token}`, body);
    },

    channelSwitch(id: number): Promise<AxiosResponse<any, any>> {
        return requests.get(`/auth/switch/${id}`)
    }
}

export default AuthServices