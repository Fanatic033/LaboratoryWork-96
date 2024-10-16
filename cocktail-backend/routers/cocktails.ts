import {Router} from "express";
import {auth, RequestWithUser} from "../middleware/auth";
import {imagesUpload} from "../multer";
import Cocktail from "../models/Cocktail";

const cocktailsRouter = Router();


cocktailsRouter.get("/", async (req, res, next) => {
    try {
        const cocktails = await Cocktail.find();
        return res.send(cocktails);
    } catch (e) {
        return next(e)
    }
});

cocktailsRouter.post("/", auth, imagesUpload.single('image'), async (req: RequestWithUser, res, next) => {
    try {
        const cocktail = await Cocktail.create({
            author: req.user?._id,
            name: req.body.name,
            recipe: req.body.recipe,
            image: req.file ? req.file.filename : null,
            ingredients: req.body.ingredients,
        })
        return res.send(cocktail)
    } catch (err) {
        next(err)
    }
})


export default cocktailsRouter