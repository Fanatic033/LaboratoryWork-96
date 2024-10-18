import React, { useState } from 'react';
import { Box, Button, Container, IconButton, TextField } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { useNavigate } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import { CocktailMutation } from '../../../types';
import CloseIcon from '@mui/icons-material/Close';
import { selectStatusOfPostingCocktails } from '../CocktailsSlice.ts';
import { createCocktails } from '../CocktailThunks.ts';
import FileInput from '../../../UI/FileInput.tsx';

const CocktailForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const loading = useAppSelector(selectStatusOfPostingCocktails);

  const onSubmit = async (CocktailMutation: CocktailMutation) => {
    try {
      await dispatch(createCocktails(CocktailMutation)).unwrap();
      navigate('/');
    } catch (e) {
      console.log(e);
    }
  };

  const [state, setState] = useState<CocktailMutation>({
    name: '',
    recipe: '',
    image: null,
    ingredients: [
      {
        name: '',
        amount: '',
      },
    ],
  });

  const submitFormHandler = (e: React.FormEvent) => {
    e.preventDefault();
    void onSubmit(state);
  };

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const inputIngredientChangeHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
    const { name, value } = e.target;
    setState((prevState) => {
      const updated = [...prevState.ingredients];
      updated[index] = { ...updated[index], [name]: value };
      return { ...prevState, ingredients: updated };
    });
  };

  const deleteInput = (index: number) => {
    setState((prevState) => {
      const updated = [...prevState.ingredients];
      updated.splice(index, 1);
      return { ...prevState, ingredients: updated };
    });
  };

  const fileInputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: files && files[0] ? files[0] : null,
    }));
  };

  const addNewField = () => {
    setState((prevState) => {
      const updated = [...prevState.ingredients];
      updated.push({ name: '', amount: '' });
      return { ...prevState, ingredients: updated };
    });
  };

  return (
    <Container maxWidth="sm" sx={{ height: '600px', marginTop: '100px' }}>
      < Box component="form" onSubmit={submitFormHandler}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              height: '600px',
            }}>
        <TextField
          sx={{ width: '100%', marginBottom: 2 }}
          label="Cocktail"
          name="name"
          value={state.name}
          onChange={inputChangeHandler}
          required
        />
        {state.ingredients.map((el, index) => (
          <Box key={index} sx={{ display: 'flex', width: '100%', marginBottom: 2 }}>
            <TextField
              sx={{ flexGrow: 1, marginRight: 2 }}
              label="Ingredient"
              name="name"
              value={el.name}
              onChange={(e) => inputIngredientChangeHandler(e, index)}
              required
            />
            <TextField
              sx={{ width: '20%' }}
              label="Amount"
              name="amount"
              value={el.amount}
              onChange={(e) => inputIngredientChangeHandler(e, index)}
              required
            />
            {index !== 0 && (
              <IconButton
                aria-label="remove"
                color="inherit"
                size="small"
                onClick={() => deleteInput(index)}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        ))}
        <Button variant="outlined" sx={{ marginBottom: 2 }} onClick={addNewField}>
          Add new ingredient
        </Button>
        <TextField
          sx={{ width: '100%', marginBottom: 2 }}
          multiline
          rows={3}
          label="Information about cocktail"
          value={state.recipe}
          onChange={inputChangeHandler}
          name="recipe"
        />
        <FileInput label="Image" onChange={fileInputChangeHandler} name="image" />
        <LoadingButton loading={loading} type="submit" color="primary" variant="contained" sx={{ marginTop: 2 }}>
          Create
        </LoadingButton>
      </Box>
    </Container>
  );
};

export default CocktailForm;
