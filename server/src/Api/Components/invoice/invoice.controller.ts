import { Request, Response, NextFunction } from 'express'
import Stripe from 'stripe';
import { SuccessResponse } from '../../../core/ApiResponse';
import { BadRequestError } from '../../../core/ApiError'
import asyncHandler from "../../../helpers/async";
import { InvoiceService } from './invoice.service'
import InvoiceRepo from './invoice.repository'
import Invoice from './invoice'
import _ from 'lodash'
import Logger from '../../../core/Logger';
import { StripeCred } from '../../../config/globals';

export class InvoiceController {

  readonly stripe: Stripe = new Stripe(StripeCred.clientSecret, { apiVersion: "2023-08-16" });
  readonly service: InvoiceService = new InvoiceService()

  retrievePaymentIntent = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const payment = await this.service.paymentIntentRetrieve(req.params.pi_id)
      new SuccessResponse('payment intent successful', { payment }).send(res);
    }
  )

  createPaymentIntent = asyncHandler(
    async (req: any, res: Response, next: NextFunction) => {

      const customerId = req.user.stripe_customerId;

      const { payment, invoice } = await this.service.paymentIntentCreate({
        body: req.body,
        customerId,
        user: req.user
      })

      new SuccessResponse('payment intent successful', { payment, invoice }).send(res); //  invoice, payment 
    }
  )

  confirmPaymentIntent = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {

      const payment = await this.service.paymentIntentRetrieve(req.params.pi_id)
      if (!payment) throw new BadRequestError('payment intent not found');

      console.log('====================================');
      console.log(payment);
      console.log('====================================');

      let invoice;
      // @ts-ignore
      if (payment.status === 'succeeded') {
        invoice = await InvoiceRepo.updateByStripe(payment.id, { status: 'paid' } as Invoice)
      } else {
        throw new BadRequestError('Invoice not paid yet!');
      }

      res.redirect("http://localhost:3000/apps/news/")
    }
  )


  getMyInvoices = asyncHandler(
    async (req: any, res: Response, next: NextFunction) => {
      const subscriptions = await InvoiceRepo.findAll({ userId: req.user.id } as Invoice) // req.user._id
      new SuccessResponse('success', { subscriptions }).send(res);
    }
  )

  getAllInvoices = asyncHandler(
    async (req: any, res: Response, next: NextFunction) => {
      const subscriptions = await InvoiceRepo.findAllAdmin()// req.user._id
      new SuccessResponse('success', { subscriptions }).send(res);
    }
  )

}