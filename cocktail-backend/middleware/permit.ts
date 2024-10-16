import {RequestWithUser} from './auth';
import {NextFunction, Response, Request} from 'express';

const permit = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as RequestWithUser).user;
        if (!user || !roles.includes(user.role)) {
            return res.status(403).send({error: 'Need more rights '});
        }
        return next();
    }
}

export default permit;