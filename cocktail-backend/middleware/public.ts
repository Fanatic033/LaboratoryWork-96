import { NextFunction, Request, Response } from 'express';
import type { HydratedDocument } from 'mongoose';
import type { UserFields, UserMethods } from '../types';
import User from '../models/User';

export interface RequestUser extends Request {
  user?: HydratedDocument<UserFields, UserMethods>;
}

export const publicGet = async (req: RequestUser, res: Response, next: NextFunction) => {
  const headerValue = req.get('Authorization');

  if (headerValue) {
    const [_bearer, token] = headerValue.split(' ');

    if (!token){
      return   next()
    }
    if (token) {
      const user = await User.findOne({ token });
      if (user) {
        req.user = user;
      }
    }
  }

  return next();
};