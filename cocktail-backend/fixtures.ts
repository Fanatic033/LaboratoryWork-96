import mongoose from 'mongoose';
import config from './config';
import User from './models/User';
import Cocktail from './models/Cocktail';

const run = async () => {
  await mongoose.connect(config.database);
  const db = mongoose.connection;
  try {
    await db.dropCollection('users');
    await db.dropCollection('cocktails');
  } catch (e) {
    console.log('skipping drop...');
  }
  const [user1, user2] = await User.create(
    {
      email: 'admin@gmail.com',
      password: 'admin',
      displayName: 'admin',
      avatar: 'fixtures/admin.png',
      role: 'admin',
      token: crypto.randomUUID(),
    },
    {
      email: 'user@gmail.com',
      password: 'user',
      displayName: 'user',
      avatar: 'fixtures/user.png',
      role: 'user',
      token: crypto.randomUUID(),
    },
  );

  await Cocktail.create(
    {
      name: 'Margarita',
      recipe: 'Fill a cocktail shaker with ice, then add the tequila, lime juice and triple sec. Shake until the outside of the shaker feels cold.',
      author: user1._id,
      isPublished: true,
      image: 'fixtures/margarita.png',
      ingredients: [
        { name: 'tequila reposado', amount: '60ml' },
        { name: 'lime juice', amount: '35ml' },
        { name: 'triple sec', amount: '20ml' },
      ],
    },
    {
      name: 'Singapore sling',
      image: 'fixtures/singapore-sling.jpeg',
      author: user2._id,
      recipe: 'Pour the Tanqueray London Dry Gin, cherry brandy and Benedictine into a mixing glass or a jug. Add the ice and Angostura bitters. Stir well until the outside of the glass feels cold.',
      isPublished: true,
      ingredients: [
        {
          name: 'Tanqueray London Dry Gin',
          amount: '25ml',
        },
        {
          name: 'cherry brandy',
          amount: '25ml',
        },
        {
          name: 'Benedictine',
          amount: '25ml',
        },
        {
          name: 'pineapple juice',
          amount: '50ml',
        },
        {
          name: 'lime juice',
          amount: '25ml ',
        },
      ],
    },
  );
  await db.close();
};

run().catch(console.error);