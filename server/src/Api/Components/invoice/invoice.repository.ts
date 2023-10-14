import Invoice, { InvoiceModel } from './invoice';
import { NoDataError, BadRequestError } from '../../../core/ApiError';

export default class InvoiceRepo {

  public static findById(id: string): Promise<Invoice | null> {
    return InvoiceModel
      .findUnique({
        where: { id },
        include: { user: true }
      })
  }

  public static findAll(query: Invoice): Promise<Invoice[]> {
    return InvoiceModel
      .findMany({
        where: { ...query, isDeleted: false },
        include: { user: true },
        orderBy: { createdAt: 'desc' }
      })
  }
  public static findAllAdmin(): Promise<Invoice[]> {
    return InvoiceModel
      .findMany({
        include: { user: true },
        orderBy: { createdAt: 'desc' }
      })
  }

  public static async create(body: Invoice): Promise<{ invoice: Invoice }> {
    const invoice = await InvoiceModel.create({
      data: body,
      include: { user: true },
    });
    return { invoice };
  }

  public static async updateByStripe(stripe: string, body: Invoice): Promise<{ invoice: Invoice }> {
    const invoice = await InvoiceModel
      .update({
        where: { stripe },
        data: body,
        include: { user: true },
      })
    if (!invoice) throw new BadRequestError('inoice not found!');
    return { invoice };
  }

  public static async delete(stripe: string): Promise<{ invoice: Invoice }> {
    const invoice = await InvoiceModel.delete({ where: { stripe } });
    if (!invoice) throw new NoDataError();
    return { invoice };
  }

}