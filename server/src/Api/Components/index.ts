import { Router, Request, Response, NextFunction } from 'express';
import { NotFoundError } from '../../core/ApiError';
import { UserRoutes } from './access/user.routes';
import { InvoiceRoutes } from './invoice/invoice.routes';

export const registerApiRoutes = (router: Router, prefix: string = ''): void => {

    router.get(prefix, (req: Request, res: Response) => res.send('❤'));
    router.use(`${prefix}/auth`, new UserRoutes().router)
    router.use(`${prefix}/invoice`, new InvoiceRoutes().router)

    router.use((req: Request, res: Response, next: NextFunction) => next(new NotFoundError()));
}