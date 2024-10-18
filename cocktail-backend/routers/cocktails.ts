import { Router } from 'express';
import { auth, RequestWithUser } from '../middleware/auth';
import { imagesUpload } from '../multer';
import Cocktail from '../models/Cocktail';
import permit from '../middleware/permit';
import mongoose from 'mongoose';

const cocktailsRouter = Router();


cocktailsRouter.get('/', async (req, res, next) => {
  try {
    const user = req.query.user as string;

    if (user && req.query.user) {
      const result = await Cocktail.find({ user: req.query.user }).populate('user', 'displayName');
      return res.send(result);
    }

    const cocktail = await Cocktail.find();
    return res.send(cocktail);
  } catch (e) {
    next(e);
  }
});
cocktailsRouter.post('/', auth, imagesUpload.single('image'), async (req: RequestWithUser, res, next) => {
  try {
    const cocktail = await Cocktail.create({
      author: req.user?._id,
      name: req.body.name,
      recipe: req.body.recipe,
      image: req.file ? req.file.filename : null,
      ingredients: req.body.ingredients,
    });
    return res.send(cocktail);
  } catch (err) {
    next(err);
  }
});

cocktailsRouter.delete('/:id', auth, permit('admin'), async (req: RequestWithUser, res, next) => {
  try {
    const cocktail_id = req.params.id;
    const cocktail = await Cocktail.findOne({ _id: cocktail_id });

    if (!cocktail) {
      return res.status(404).send({ error: 'Not found!' });
    }

    await Cocktail.deleteOne({ _id: cocktail_id });
    return res.send('Cocktail deleted');
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(error);
    }

    return next(error);
  }
});


export default cocktailsRouter;