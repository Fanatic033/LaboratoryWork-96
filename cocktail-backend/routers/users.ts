import express from 'express';
import {Error} from 'mongoose';
import {auth, RequestWithUser} from '../middleware/auth';
import config from '../config';
import {imagesUpload} from '../multer';
import crypto from 'crypto';
import User from "../models/User";
import {OAuth2Client} from "google-auth-library";


const usersRouter = express.Router();
const client = new OAuth2Client(config.google.clientId);


usersRouter.post('/', imagesUpload.single('avatar'), async (req, res, next) => {
    try {
        const user = new User({
            email: req.body.email,
            password: req.body.password,
            displayName: req.body.displayName,
            avatar: req.file ? req.file.filename : null,
        });
        user.generateToken();

        await user.save();
        return res.send(user);
    } catch (error) {
        if (error instanceof Error.ValidationError) {
            return res.status(400).send(error);
        }
        return next(error);
    }

});


usersRouter.post('/sessions', async (req, res, next) => {
    try {
        const user = await User.findOne({email: req.body.email});
        if (!user) {
            return res.status(400).send({error: 'User not found'});
        }
        const isMatch = await user.checkPassword(req.body.password);
        if (!isMatch) {
            return res.status(400).send({error: 'wrong password'});
        }

        user.generateToken()
        await user.save()

        res.send(user)
    } catch (e) {
        return next(e);
    }
})

usersRouter.delete('/sessions', auth, async (req: RequestWithUser, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).send({error: 'User not found'});
        }

        return res.status(204).send();
    } catch (error) {
        return next(error);
    }
})
usersRouter.post('/google', async (req, res, next) => {
    try {
        const ticket = await client.verifyIdToken({
            idToken: req.body.credential,
            audience: config.google.clientId,
        });
        const payload = ticket.getPayload();
        if (!payload) {
            return res.status(400).send({error: 'Google login error!'});
        }
        const email = payload['email'];
        const id = payload['sub'];
        const displayName = payload['name'];
        const avatar = payload['picture'];

        if (!email) {
            return res.status(400).send({error: 'Not enough user data to continue'});
        }
        let user = await User.findOne({googleID: id});
        if (!user) {
            user = new User({
                email: email,
                password: crypto.randomUUID(),
                googleID: id,
                displayName,
                avatar: avatar ? avatar : null,
            });
        }
        user.generateToken();

        await user.save();

        return res.send({message: 'Login with Google successful!', user});
    } catch (e) {
        return next(e);
    }
});


export default usersRouter;
