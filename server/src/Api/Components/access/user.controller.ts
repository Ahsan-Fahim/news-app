import { Response, Request, NextFunction } from "express"
import asyncHandler from "../../../helpers/async";
import UserRepo from './user.repository';
import { BadRequestError } from '../../../core/ApiError';
import User from './User';
import { SuccessResponse, SuccessMsgResponse } from '../../../core/ApiResponse';
import { generateTokenKey } from "../../../helpers/tokenKeyGenerator";
import _ from 'lodash';
import { createTokens, getAccessToken } from '../../../utils/authUtils';
import KeystoreRepo from './keystore.repository';
import { TokenService } from '../token/token.service'
import Token from '../token/Token'
import { comparePassword } from "../../../utils/password";
import { Prisma } from "@prisma/client";

export class UserController {

    private tokenService: TokenService = new TokenService()

    signup = asyncHandler(
        async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {
            const user = await UserRepo.findByEmail(req.body.email);
            if (user) throw new BadRequestError('User already registered');
            // if (user && user.email) throw new BadRequestError('User already registered');

            const accessTokenKey = generateTokenKey();
            const refreshTokenKey = generateTokenKey();

            const { user: createdUser, keystore } = await UserRepo.create(
                req.body as User,
                accessTokenKey,
                refreshTokenKey,
                "USER",
            );
            if (!createdUser) throw new BadRequestError('User creation field!');
            const tokens = await createTokens(createdUser, keystore.primaryKey, keystore.secondaryKey);

            // const { token } = await this.tokenService.createToken({
            //     token: generateTokenKey(),
            //     type: 'SIGNUP',
            //     userId: createdUser.id,
            //     expireAt: new Date()
            // } as Token)

            // console.log("Token: ", token)
            new SuccessResponse('Signup Successful', {
                user: _.pick(createdUser, ['id', 'first_name', 'last_name', 'email', 'phone', 'stripe_customerId', 'role', 'profilePicUrl', 'gender']),
                tokens
            }).send(res);
        }
    )

    signin = asyncHandler(
        async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {

            const user = await UserRepo.findByEmail(req.body.email);
            console.log('====================================');
            console.log(user);
            console.log('====================================');
            if (!user) throw new BadRequestError('Invalid credentials');
            if (!user.password) throw new BadRequestError('Credential not set');
            if (!user.status) throw new BadRequestError('User InActive');

            // if (user.phone_status !== "VERIFIED") {
            //     const { token } = await this.tokenService.createToken({
            //         token: generateTokenKey(),
            //         type: 'SIGNIN',
            //         userId: user.id,
            //         expireAt: new Date()
            //     } as Token)

            //     console.log("Signin OTP: ", token)
            //     throw new BadRequestError('please verify your phone!');
            // }

            await comparePassword(req.body.password, user.password)

            const accessTokenKey = generateTokenKey();
            const refreshTokenKey = generateTokenKey();

            await KeystoreRepo.create(user.id, accessTokenKey, refreshTokenKey);

            const tokens = await createTokens(user, accessTokenKey, refreshTokenKey);

            new SuccessResponse('Login Success', {
                user: _.pick(user, ['id', 'first_name', 'last_name', 'email', 'profile_picture', 'stripe_customerId', 'role', 'phone_status', 'profilePicUrl', 'gender']),
                tokens: tokens,
            }).send(res);

        }
    )


    getMe = asyncHandler(
        async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {

            const user = await UserRepo.findById(req.user.id);
            new SuccessResponse('fetch success', { user }).send(res);

        }
    )

    getUserById = asyncHandler(
        async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {

            const user = await UserRepo.findById(req.params.id);
            new SuccessResponse('fetch success', { user }).send(res);

        }
    )

    updateUser = asyncHandler(
        async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
            const { body, params } = req;
            const user = await UserRepo.update(params.id, body);
            new SuccessResponse('update success', { user }).send(res);
        }
    )

    updateMe = asyncHandler(
        async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {
            const { body } = req;
            const users = req.user.id;
            const user = await UserRepo.update(users, body);
            new SuccessResponse('update success', { user }).send(res);
        }
    )

    delete = asyncHandler(
        async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
            const { params } = req;
            const user = await UserRepo.delete(params.id);
            new SuccessResponse('delete success', { user }).send(res);
        }
    )

    verifyEmail = asyncHandler(
        async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {
            const user = await UserRepo.findByEmail(req.body.email);
            if (user) throw new BadRequestError('User already registered');

            new SuccessMsgResponse('Email Not Found')
        }
    )

    // forgotPassword = asyncHandler(
    //     async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {

    //         const user = await UserRepo.findByEmail(req.body.email);
    //         if (!user || !user.email) throw new SuccessMsgResponse('Email send success, Check your email').send(res);

    //         const { token } = await this.tokenService.createToken({
    //             shot_code: generateTokenKey(5),
    //             token: generateTokenKey(),
    //             type: 'FORGOT_PASSWORD',
    //             userId: user.id,
    //             expireAt: new Date()
    //         } as Token)

    //         let link = `http://localhost:5001/api/v1/auth/reset-password/?token=${token?.token}&user=${token?.userId}&email=${user.email}`
    //         if (user && user.email) {
    //             // @ts-ignore
    //             // sendMail({ subject: 'iPrint (Forgot Password)', to: user.email, text: link })
    //         }
    //         console.log("==== link ====", link);

    //         new SuccessMsgResponse('Email send success, Check your email').send(res);
    //     }
    // )

    // resetPassword = asyncHandler(
    //     async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    //         const { token, otp } = req.query;

    //         if (!Boolean(_.isString(token) || _.isString(otp))) throw new BadRequestError('Invalid Request')
    //         const tokenfound = await this.tokenService.verifyCode({ code: token as string, type: 'FORGOT_PASSWORD' })

    //         await UserRepo.updatePassword(tokenfound.userId, { password: req.body.password });
    //         new SuccessMsgResponse('password reset Successful').send(res);
    //     }
    // )

    passwordOTPVerify = asyncHandler(
        async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
            const { otp, email } = req.body;
            const user = await UserRepo.findByEmail(email);
            if (!user) throw new BadRequestError('User not exist');

            const userId = user.id

            if (!_.isString(userId) || !_.isString(otp)) throw new BadRequestError('Invalid Request')
            //@ts-ignore
            const otpfound = await this.tokenService.findForPasswordVerification({ otp, userId })
            if (!otpfound) throw new BadRequestError('OTP Expire') //  || tokenfound.expireAt < new Date()

            new SuccessResponse('otp success', { user: userId }).send(res);
        }
    )

    verifyPassword = asyncHandler(
        async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
            const { user } = req.query;

            // if (!_.isString(user) || _.isString(otp)) throw new BadRequestError('Invalid Request')
            //@ts-ignore

            await UserRepo.update(user, { password: req.body.password } as User);
            new SuccessMsgResponse('password update success').send(res);

        }
    )



}
