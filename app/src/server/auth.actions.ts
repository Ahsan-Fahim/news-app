"use server"

import { AuthServices } from "@/services"
import { formDataToJson } from "@/utils/formDataToJson"

export const login = async ({ body }: { body: FormData }) => {

    const { data } = await AuthServices.login(formDataToJson(body))

    return data
}

export const signup = async ({ body }: { body: FormData }) => {

    const { data } = await AuthServices.signup(formDataToJson(body))

    return data
}