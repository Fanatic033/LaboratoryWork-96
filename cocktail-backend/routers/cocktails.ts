import { Router } from 'express';
import { auth, RequestWithUser } from '../middleware/auth';
import { imagesUpload } from '../multer';
import Cocktail from '../models/Cocktail';
import permit from '../middleware/permit';
import mongoose from 'mongoose';
import { publicGet } from '../middleware/public';

const cocktailsRouter = Router();


cocktailsRouter.get('/', publicGet, async (req: RequestWithUser, res) => {
  try {
    if (req.user && req.user?.role === 'admin') {
      const cocktails = await Cocktail.find();
      return res.send(cocktails);
    }
    if (req.user) {
      const cocktails = await Cocktail.find({ author: req.user._id });
      return res.send(cocktails);
    }
    const cocktails = await Cocktail.find({ isPublished: true });
    return res.send(cocktails);

  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
});

cocktailsRouter.get('/:id', publicGet, async (req, res) => {
  try {
    const response = await Cocktail.find({ _id: req.params.id });
    return res.send(response);
  } catch {
    return res.sendStatus(500);
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

cocktailsRouter.patch(
  '/:id/togglePublished',
  auth,
  permit('admin'),
  async (req, res, next) => {
    try {
      const cocktail_id = req.params.id;
      const cocktail = await Cocktail.findById(cocktail_id);

      if (!cocktail) {
        return res.status(404).send({ error: 'Not found!' });
      }

      cocktail.isPublished = !cocktail.isPublished;

      await Cocktail.findByIdAndUpdate(cocktail_id, {
        isPublished: !cocktail.isPublished,
      });

      await cocktail.save();
      return res.send(cocktail);
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        return res.status(400).send(error);
      }

      return next(error);
    }
  },
);


export default cocktailsRouter;