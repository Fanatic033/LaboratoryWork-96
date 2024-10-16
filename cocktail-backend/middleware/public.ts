import { NextFunction, Request, Response } from "express";
import { HydratedDocument } from "mongoose";
import User from "../models/User";
import {UserFields, UserMethods} from "../types";
export interface RequestWithUser extends Request {
    user: HydratedDocument<UserFields,UserMethods>;
}

const publicRole = async (expressReq: Request, res: Response, next: NextFunction) => {
    const req = expressReq as RequestWithUser;
    const token = await req.get("Authorization");
    const user = await User.findOne({ token });
    if (user) {
        req.user = user;
    }
    next();
};

export default publicRole;