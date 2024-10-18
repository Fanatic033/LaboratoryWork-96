import React from 'react';
import { Cocktail } from '../../../types';
import { Box, Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import noImage from '@/assets/image-not-found.png';
import { selectStatusOfDeletingCocktails, selectStatusOfPostingCocktails } from '../CocktailsSlice.ts';
import { selectUser } from '../../User/userSlice.ts';
import { deleteCocktails, getCocktails, patchCocktails } from '../CocktailThunks.ts';
import { API_URL } from '../../../constants.ts';

interface state {
  cocktail: Cocktail;
}

const CocktailCard: React.FC<state> = ({ cocktail }) => {
  const user = useAppSelector(selectUser);
  const deleting = useAppSelector(selectStatusOfDeletingCocktails);
  const loading = useAppSelector(selectStatusOfPostingCocktails);
  const dispatch = useAppDispatch();
  const cardImage = cocktail.image ? `${API_URL}/${cocktail.image}` : noImage;
  const navigate = useNavigate();

  const onPublic = async () => {
    await dispatch(patchCocktails(cocktail._id));
    await dispatch(getCocktails());
  };

  const onDelete = async () => {
    if (window.confirm('Are you sure you want to delete?')) {
      await dispatch(deleteCocktails(cocktail._id));
      await dispatch(getCocktails());
    }
  };

  const onClickNavigate = () => {
    navigate('/cocktails/' + cocktail._id);
  };

  return (
    <Card sx={{
      width: '300px',
      height: '100%',
      minHeight: '400px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <CardMedia component="img" height="100%" image={cardImage} alt="cocktail" sx={{ width: '68%' }} />
      <CardContent sx={{ flexGrow: 1 }}>
        <CardActionArea onClick={onClickNavigate}>
          <Typography gutterBottom variant="h5" component="div">
            {cocktail.name}
          </Typography>
        </CardActionArea>
        {!cocktail.isPublished && (
          <Typography variant="body1" color="red">
            Waiting Moderator Checking
          </Typography>
        )}

      </CardContent>
      {user?.role === 'admin' && !cocktail.isPublished && (
        <Box mb={2}>
          <LoadingButton variant="contained" onClick={onPublic} loading={loading}>
            Publish toggle
          </LoadingButton>
        </Box>
      )}
      {user?.role === 'admin' ? (
        <LoadingButton variant="contained" onClick={onDelete} loading={deleting}
                       sx={{ width: '300px', marginBottom: '10px' }} color={'error'}>
          Delete
        </LoadingButton>
      ) : (
        ''
      )}
    </Card>
  );
};

export default CocktailCard;