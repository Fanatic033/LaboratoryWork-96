import {Model} from "mongoose";

export interface UserFields {
    email: string;
    displayName: string;
    avatar: string | null;
    password: string;
    role: string;
    token: string;
    googleID?: string;
}

export interface UserMethods {
    checkPassword(password: string): Promise<Boolean>;

    generateToken(): void
}

export type UserModel = Model<UserFields, {}, UserMethods>


