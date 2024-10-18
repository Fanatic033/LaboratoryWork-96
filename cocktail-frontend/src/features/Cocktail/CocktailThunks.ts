import { createAsyncThunk } from '@reduxjs/toolkit';
import { Cocktail, CocktailMutation } from '../../types';
import axiosApi from '../../axiosApi.ts';

export const getCocktails = createAsyncThunk<Cocktail[]>('Cocktails/getAll', async () => {
  try {
    const response = await axiosApi.get('/cocktails');
    return response.data;
  } catch (e) {
    return e;
  }
});

export const createCocktails = createAsyncThunk<Cocktail, CocktailMutation>(
  'Cocktails/new',
  async (arg) => {
    try {
      const formData = new FormData();
      const keys = Object.keys(arg) as (keyof CocktailMutation)[];
      keys.forEach((key) => {
        const value = arg[key];
        if (value !== null) {
          if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value);
          }
        }
      });
      const response = await axiosApi.post('/cocktails', formData);
      return response.data;
    } catch (e) {
      return e;
    }
  });



export const deleteCocktails = createAsyncThunk<Cocktail, string>('Cocktails/delete', async (arg) => {
  try {
    const response = await axiosApi.delete('/cocktails/' + arg);
    return response.data;
  } catch (e) {
    return e;
  }
});