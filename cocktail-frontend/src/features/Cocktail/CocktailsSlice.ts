import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { Cocktail } from '../../types';
import {
  createCocktails, deleteCocktails,
  getCocktails, patchCocktails,
} from './CocktailThunks.ts';

interface Initial {
  cocktails: Cocktail[];
  loading: boolean;
  posting: boolean;
  deleting: boolean;
}

const initialState: Initial = {
  cocktails: [],
  loading: false,
  posting: false,
  deleting: false,
};

export const CocktailsPageSlice = createSlice({
  name: 'Cocktails',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCocktails.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getCocktails.fulfilled, (state, action) => {
      state.cocktails = action.payload;
      state.loading = false;
    });
    builder.addCase(getCocktails.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(createCocktails.pending, (state) => {
      state.posting = true;
    });
    builder.addCase(createCocktails.fulfilled, (state) => {
      state.posting = false;
    });
    builder.addCase(createCocktails.rejected, (state) => {
      state.posting = false;
    });

    builder.addCase(deleteCocktails.pending, (state) => {
      state.deleting = true;
    });
    builder.addCase(deleteCocktails.fulfilled, (state) => {
      state.deleting = false;
    });
    builder.addCase(deleteCocktails.rejected, (state) => {
      state.deleting = false;
    });
    builder.addCase(patchCocktails.pending, (state) => {
      state.posting = true;
    });
    builder.addCase(patchCocktails.fulfilled, (state) => {
      state.posting = false;
    });
    builder.addCase(patchCocktails.rejected, (state) => {
      state.posting = false;
    });
  },
});

export const CocktailsReducer = CocktailsPageSlice.reducer;
export const selectStateOfCocktails = (state: RootState) => state.cocktails.cocktails;
export const selectStatusOfCocktails = (state: RootState) => state.cocktails.loading;
export const selectStatusOfPostingCocktails = (state: RootState) => state.cocktails.posting;
export const selectStatusOfDeletingCocktails = (state: RootState) => state.cocktails.deleting;
