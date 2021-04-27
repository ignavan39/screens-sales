// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

export const JWT_SECRET = process.env.JWT_SECRET;
export const CRYPTO_ROUND = +process.env.CRYPTO_ROUND;
export const DB_HOST = process.env.DB_HOST;
export const DB_USER = process.env.DB_USER;
export const DB_PASS = process.env.DB_PASS;
export const DB_NAME = process.env.DB_NAME;
export const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
export const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
export const AWS_REGION = process.env.AWS_REGION;
export const AWS_PUBLIC_BUCKET_NAME = process.env.AWS_PUBLIC_BUCKET_NAME;
export const AUTH0_AUDIENCE = process.env.AUTH0_AUDIENCE;
export const AUTH0_ISSUER_URL = process.env.AUTH0_ISSUER_URL;
export const DOMAIN = process.env.DOMAIN;
export const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID;
export const AUTH0_CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET;
export const AUTH0_CALLBACK_URL = process.env.AUTH0_CALLBACK_URL;
