"use server"

import { NewsServices } from "@/services"

export const getAll = async ({ body }: { body: string }) => {

    const { data } = await NewsServices.getAll(body)

    return data
}