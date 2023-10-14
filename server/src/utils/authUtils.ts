import { Tokens } from "app-request";
import { AuthFailureError, InternalError } from "../core/ApiError";
import JWT, { JwtPayload } from "../core/JWT";
import User from "../Api/Components/access/User";
import { tokenInfo } from "../config/globals";

export const getAccessToken = (authorization?: string) => {
    if (!authorization) throw new AuthFailureError("Invalid Authorization");
    if (!authorization.startsWith("Bearer "))
        throw new AuthFailureError("Invalid Authorization");
    return authorization.split(" ")[1];
};

export const validateTokenData = (payload: JwtPayload): boolean => {
    if (
        !payload ||
        !payload.iss ||
        !payload.aud ||
        !payload.sub ||
        !payload.prm ||
        payload.iss !== tokenInfo.issuer ||
        payload.aud !== tokenInfo.audience
    )
        throw new AuthFailureError("Invalid Access Token");
    return true;
};

export const createTokens = async (
    user: User,
    accessTokenKey: string,
    refreshTokenKey: string
): Promise<Tokens> => {
    const accessToken = await JWT.encode(
        new JwtPayload(
            tokenInfo.issuer,
            tokenInfo.audience,
            user.id.toString(),
            accessTokenKey,
            tokenInfo.accessTokenValidityDays
        )
    );

    if (!accessToken) throw new InternalError();

    const refreshToken = await JWT.encode(
        new JwtPayload(
            tokenInfo.issuer,
            tokenInfo.audience,
            user.id.toString(),
            refreshTokenKey,
            tokenInfo.refreshTokenValidityDays
        )
    );

    if (!refreshToken) throw new InternalError();

    return {
        accessToken: accessToken,
        refreshToken: refreshToken,
    } as Tokens;
};
