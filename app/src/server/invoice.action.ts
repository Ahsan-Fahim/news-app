"use server"

import { InvoiceService } from "@/services"
import { formDataToJson } from "@/utils/formDataToJson"

export const createIntent = async () => {

    const { data } = await InvoiceService.createPaymentIntent()

    return data
}

export const getInvoices = async () => {

    const { data } = await InvoiceService.getInvoices()

    return data
}