import { Router } from 'express';
import { UserController } from './user.controller';
import validator from '../../../helpers/validator';
import authentication from '../../../middleware/authentication';
import authorization from '../../../middleware/authorization';
import schema from './schema';
import { RoleEnum } from '../roles/Role';

export class UserRoutes {

  readonly router: Router = Router();
  readonly controller: UserController = new UserController()

  constructor() {
    this.initRoutes();
  }

  initRoutes(): void {

    this.router.post(
      '/signup',
      validator(schema.signup),
      this.controller.signup
    )

    this.router.post(
      '/signin',
      validator(schema.userCredential),
      this.controller.signin
    )

    this.router.get(
      '/me',
      authentication,
      // authorization(["ADMIN", "COMPANY_ADMIN", "ADMIN", "MANAGER", "ADMIN"]),
      this.controller.getMe
    )

    this.router.put(
      '/users/:id',
      authentication,
      // authorization(["COMPANY_ADMIN", "ADMIN"]),
      // validator(employeeUpdateSchema),
      this.controller.updateUser
    )

    this.router.put(
      '/update/me',
      authentication,
      // authorization(["COMPANY_ADMIN", "ADMIN"]),
      // validator(employeeUpdateSchema),
      this.controller.updateMe
    )

    this.router.delete(
      '/users/:id',
      authentication,
      // authorization(["COMPANY_ADMIN", "ADMIN"]),
      this.controller.delete
    )

    this.router.get(
      '/users/:id',
      authentication,
      authorization([RoleEnum.ADMIN]),
      this.controller.getUserById
    )

    this.router.get(
      '/email-verify',
      this.controller.verifyEmail
    )

    this.router.post(
      '/password-otp',
      // authentication,
      // validator(refreshToken),
      this.controller.passwordOTPVerify
    )

    this.router.post(
      '/password-verify',
      this.controller.verifyPassword
    )

  }

}
