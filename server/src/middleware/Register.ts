import express, { json, Router } from 'express';
import path from 'path';

import cors from "cors";
import helmet from "helmet";
import compression from "compression"

const registerMiddleware = (router: Router): void => {

    router.use(express.static(path.join(__dirname, "../../client/build")));

    router.use(cors({ origin: '*' }));

    // if (environment === 'development') {
    //   router.use(cors({ origin: '*' }));
    // } else {
    //   router.use(cors({ origin: corsUrl, optionsSuccessStatus: 200 }));
    // }

    router.use(helmet());
    router.use(json());
    router.use(compression());

}

export default registerMiddleware
