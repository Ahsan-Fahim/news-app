import Stripe from 'stripe';
import { BadRequestError } from '../../../core/ApiError';
import { StripeCred } from "../../../config/globals"
import UserRepo from '../access/user.repository'
import User, { DOCUMENT_NAME as USER_DOCUMENT_NAME } from "../access/User"
import InvoiceRepo from './invoice.repository'
import Logger from '../../../core/Logger';
import Invoice from './invoice';
import { BadRequestResponse } from '../../../core/ApiResponse';

export class InvoiceService {
  readonly stripe: Stripe = new Stripe(StripeCred.clientSecret, { apiVersion: "2023-08-16" });

  async _paymentIntentCreate(
    { amount, currency, customer, description }: { amount: number, description: string, currency: 'usd', customer?: string | null }
  ) {
    const intent: any = { amount, currency, description, payment_method_types: ['card'] };
    if (customer) {
      intent.customer = customer;
    }
    return this.stripe.paymentIntents.create(intent);
  }

  async paymentIntentCreate({ body, customerId, user }: { body: any, customerId: null | string, user: User }) {

    if (!user) throw new BadRequestResponse("user not found")

    if (user.stripe_customerId) {
      const customer = await this.updateCustomer(user.stripe_customerId, {
        email: body.email,
        name: body.name,
      })
      customerId = customer.id;
      Logger.info(`stripe customer updated ${customerId}`);
    } else {
      const customer = await this.createCustomer({
        email: body.email,
        name: body.name,
      })
      customerId = customer.id;
      Logger.info(`stripe customer created ${customerId}`);
    }

    const payment = await this._paymentIntentCreate({
      currency: 'usd',
      customer: customerId,
      amount: 100, // Number(subscription.price)
      description: user.first_name || "",
    })

    try {
      UserRepo.updateInfo(user.id, {
        stripe_customerId: customerId
      } as User)

    } catch (error) {
      console.log(`Error updating userInfo : ${user.id} body: ${body.shipping} user : ${user.toString()} `, error);
    }
    const { invoice } = await InvoiceRepo.create({
      stripe: payment.id,
      price: 10 * 100,
      currency: 'USD',
      userId: user.id,
      status: 'initiated',
    } as Invoice);

    return { payment, invoice };
  }


  async paymentIntentRetrieve(pi_id: string) {
    return this.stripe.paymentIntents.retrieve(pi_id);
  }

  async createCustomer(user: Stripe.CustomerCreateParams) {
    const customer = await this.stripe.customers.create(user);
    return customer;
  }

  async updateCustomer(customeId: string, customer: Stripe.CustomerCreateParams) {
    const customerUpdated = await this.stripe.customers.update(customeId, customer);
    return customerUpdated;
  }

}