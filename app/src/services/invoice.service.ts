import request from './http.service';
import { AxiosResponse } from 'axios'

const Services = {
    createPaymentIntent(): Promise<AxiosResponse> {
        return request.post(`/invoice/payment_intents`);
    },
    paymentIntentConfirm(intentId: string): Promise<AxiosResponse> {
        return request.get(`/invoice/payment_intents/confirm/${intentId}`,);
    },
    getInvoices(): Promise<AxiosResponse> {
        return request.get(`/invoice`);
    }
};

export default Services;
