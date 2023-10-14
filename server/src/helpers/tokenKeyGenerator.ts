import crypto from 'crypto';
export const generateTokenKey = (bytes: number = 64, algo: 'hex' = 'hex') => {
    return crypto.randomBytes(bytes).toString(algo)
}