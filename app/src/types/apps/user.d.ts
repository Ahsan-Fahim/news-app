export interface IUser {
    id: string
    first_name: string
    last_name: string
    email: string
    username?: string
    status?: string
}

export interface IUserApi extends IUser {
    id: string,
    createdAt: Date
    updatedAt: Date
}

export interface IUserForm extends IUser { }

export type IUserKeys = keyof IUserForm;
