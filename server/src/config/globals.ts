
require('dotenv').config()

enum ENVIROMENT_TYPE {
    development = "development",
    production = "production",
}

// @ts-ignore
export const environment: ENVIROMENT_TYPE = process.env.NODE_ENV;
// @ts-ignore
export const port: number = process.env.PORT;
// @ts-ignore
export const slack_port: number = process.env.SLACK_PORT;

export const DATABASE = {
    development: process.env.DB_URI,
    production: process.env.DB_URI,
}

export const StripeCred = {
    clientSecret: "sk_test_51Hso8uArFHWptmq0NMANBuqJaojG6x1uqz5RjE0rMr91DeGSVzYEv1o0fqHirXrZAGqAL8iLbLWIuhaT0tlBdEjp00by5g0qE1",
    development: {
        clientSecret: "sk_test_51Hso8uArFHWptmq0NMANBuqJaojG6x1uqz5RjE0rMr91DeGSVzYEv1o0fqHirXrZAGqAL8iLbLWIuhaT0tlBdEjp00by5g0qE1"
    },
    production: {
        clientSecret: "sk_test_51Hso8uArFHWptmq0NMANBuqJaojG6x1uqz5RjE0rMr91DeGSVzYEv1o0fqHirXrZAGqAL8iLbLWIuhaT0tlBdEjp00by5g0qE1"
    }
}

// // Environment variables imported from .env file
export const env = {
    DB: {
        [ENVIROMENT_TYPE.development]: { uri: process.env.DB_URI },
        [ENVIROMENT_TYPE.production]: { uri: process.env.DB_URI },
    },
    NODE_ENV: process.env.NODE_ENV || "development",
    NODE_PORT: process.env.PORT || 5000,
    API_VERSION: "v1",
    DOMAIN: process.env.DOMAIN,
    lOGD_IRECTORY: process.env.LOGDIRECTORY || './logs',
};

export const corsUrl: string[] = [];

export const tokenInfo = {
    accessTokenValidityDays: parseInt('30d'),
    refreshTokenValidityDays: parseInt('30d'),
    issuer: process.env.TOKEN_ISSUER || 'News',
    audience: process.env.TOKEN_AUDIENCE || 'News',
};