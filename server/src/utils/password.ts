import bcrypt from "bcrypt"
import { AuthFailureError } from '../core/ApiError';

export const comparePassword = async (password: string, hash: string) => {
    const match = bcrypt.compareSync(password, hash);
    if (!match) throw new AuthFailureError('Invalid Old Password');
    else return match;
}