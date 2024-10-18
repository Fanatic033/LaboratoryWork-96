import React from 'react';
import { Cocktail } from '../../../types';
import {  Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import noImage from '@/assets/image-not-found.png';
import { selectStatusOfDeletingCocktails, } from '../CocktailsSlice.ts';
import { selectUser } from '../../User/userSlice.ts';
import { deleteCocktails, getCocktails, } from '../CocktailThunks.ts';
import { API_URL } from '../../../constants.ts';

interface state {
  cocktail: Cocktail;
}

const CocktailCard: React.FC<state> = ({ cocktail }) => {
  const user = useAppSelector(selectUser);
  const deleting = useAppSelector(selectStatusOfDeletingCocktails);
  const dispatch = useAppDispatch();
  const cardImage = cocktail.image ? `${API_URL}/${cocktail.image}` : noImage;
  const navigate = useNavigate();



  const onDelete = async () => {
    await dispatch(deleteCocktails(cocktail._id));
    await dispatch(getCocktails());
  };

  const onClickNavigate = () => {
    navigate('/cocktails/' + cocktail._id);
  };

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia component="img" height="300" image={cardImage} alt="cocktail" sx={{width: '68%'}} />
      <CardContent>
        <CardActionArea onClick={onClickNavigate}>
          <Typography gutterBottom variant="h5" component="div">
            {cocktail.name}
          </Typography>
        </CardActionArea>
        {!cocktail.isPublished && (
          <Typography variant="body1" color="red">
            Unpublished
          </Typography>
        )}
        {user?.role === 'admin' ? (
          <LoadingButton variant="contained" onClick={onDelete} loading={deleting}>
            Delete
          </LoadingButton>
        ) : (
          ''
        )}
      </CardContent>
    </Card>
  );
};

export default CocktailCard;