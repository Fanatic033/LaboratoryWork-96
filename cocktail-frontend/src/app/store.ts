import { configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { persistStore } from 'redux-persist';
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE } from 'redux-persist/es/constants';
import persistReducer from 'redux-persist/es/persistReducer';
import { usersReducer } from '../features/User/userSlice.ts';
import { CocktailsReducer } from '../features/Cocktail/CocktailsSlice.ts';

const usersPersistConfig = {
  key: 'cocktails',
  storage,
  whiteList: ['user'],
};

const rootReducer = {
  cocktails: CocktailsReducer,
  users: persistReducer(usersPersistConfig, usersReducer),
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    });
  },
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;