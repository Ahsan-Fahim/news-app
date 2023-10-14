import { Router, Request, Response, NextFunction } from 'express';
import { ApiError, InternalError, BadRequestError } from '../core/ApiError';
import Logger from "../core/Logger"

const registerErrorHandler = (router: Router): Response | void => {
    router.use((err: any, req: Request, res: Response, next: NextFunction) => {
        if (err instanceof ApiError) {
            Logger.error(err);
            ApiError.handle(err, res);
        } else {
            console.log('====================================');
            console.log("CODE", err.code);
            console.log(err.code, err);
            console.log('====================================');

            if (err.code === "P2003") { // https://www.prisma.io/docs/reference/api-reference/error-reference#p2003
                ApiError.handle(new BadRequestError("You can't delete this! his associate data exist in another table"), res);
            }

            if (err.code === 11000) { // Mongoose duplicate key
                const object = Object.keys(err.keyValue);
                const error = `${object[0]} ${err.keyValue[object[0]]} is already Exists`;
                ApiError.handle(new InternalError(error), res);
            }
            else if (err.name === "CastError") {
                ApiError.handle(new BadRequestError(`Invalid Id, ${err.reason}`), res);
            }
            else if (err.name === 'ValidationError') { // Mongoose validation error
                Object.values(err.errors).map((obj: any) => {
                    if (obj.kind === 'Number' || obj.kind === 'Number') {
                        ApiError.handle(new BadRequestError(`${obj.path} must be ${obj.kind}`), res);
                    }
                    if (obj.kind === 'ObjectId') {
                        ApiError.handle(new BadRequestError(`${obj.value} is not a valid value for the ${obj.path} field`), res);
                    }
                    if (obj.kind === 'required') {
                        ApiError.handle(new BadRequestError(obj.message), res);
                    }
                    if (obj.kind === 'enum') {
                        ApiError.handle(new BadRequestError(`${obj.value} is not a valid value for ${obj.path}`), res);
                    } else {
                        ApiError.handle(new BadRequestError("Invalid body!"), res);
                    }
                });
            }
            else {
                ApiError.handle(new InternalError(), res);
            }
        }
    });
}

export default registerErrorHandler
