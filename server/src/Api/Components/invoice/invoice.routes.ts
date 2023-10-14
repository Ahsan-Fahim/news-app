import { Router } from 'express';
import { InvoiceController } from './invoice.controller';
import validator, { ValidationSource } from '../../../helpers/validator';
import schema from './schema';
import authentication from '../../../middleware/authentication';

export class InvoiceRoutes {

  readonly router: Router = Router();
  readonly controller: InvoiceController = new InvoiceController()

  constructor() {
    this.initRoutes();
  }

  initRoutes(): void {

    this.router.get('/admin',
      // authentication,
      this.controller.getAllInvoices
    );

    this.router.post('/payment_intents',
      authentication,
      this.controller.createPaymentIntent
    );

    this.router.get('/payment_intents/confirm/:pi_id',
      // authentication,
      this.controller.confirmPaymentIntent
    );

    this.router.get('/',
      authentication,
      this.controller.getMyInvoices
    );

  }

}