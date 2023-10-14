import TokenRepo from './token.repository'
import Token from './Token'
import { AuthFailureError } from '../../../core/ApiError';

export class TokenService {

    public async createToken(token: Token): Promise<{
        token: Token | null;
    }> {
        const tokenCreated = await TokenRepo.create(token)
        return { token: tokenCreated }
    }

    public async findForEmailVerification({ user, token, otp }: {
        user: string,
        token?: string,
        otp?: string,
    }): Promise<Token | null> {
        const tokenfound = await TokenRepo.find({
            userId: user,
            shot_code: otp,
            token,
            type: 'SIGNIN'
        })
        return tokenfound;
    }

    public async verifyCode(
        { code, type }: { code: string, type: Token['type'] }
    ): Promise<Token> {
        const tokenfound = await TokenRepo.findOne({
            where: {
                type,
                OR: [
                    {
                        token: code
                    },
                    {
                        shot_code: code
                    }
                ],
                // expireAt: {
                //   gte: new Date()
                // }
            }
        })
        if (!tokenfound) throw new AuthFailureError('invalid or expire token')
        return tokenfound;
    }

}


