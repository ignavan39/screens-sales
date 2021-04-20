require('dotenv').config();

export const JWT_SECRET = process.env.JWT_SECRET;
export const CRYPTO_ROUND = +process.env.CRYPTO_ROUND;
export const DB_HOST = process.env.DB_HOST;
export const DB_USER = process.env.DB_USER;
export const DB_PASS = process.env.DB_PASS;
export const DB_NAME = process.env.DB_NAME;
