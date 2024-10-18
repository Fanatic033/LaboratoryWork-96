import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { useParams } from 'react-router-dom';
import { Box, CircularProgress, Container, List, ListItem, Typography } from '@mui/material';
import noImage from '@/assets/image-not-found.png';
import { selectStateOfCocktails, selectStatusOfCocktails } from './CocktailsSlice.ts';
import { API_URL } from '../../constants.ts';
import { getOneCocktail } from './CocktailThunks.ts';

const OneCocktailPage = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const cocktail = useAppSelector(selectStateOfCocktails)[0];
  const loading = useAppSelector(selectStatusOfCocktails);
  let ImgUrl;
  if (cocktail) {
    if (cocktail.image) {
      ImgUrl = `${API_URL}/${cocktail.image}`;
    } else {
      ImgUrl = noImage;
    }
  }

  const callBack = useCallback(async () => {
    await dispatch(getOneCocktail(id!));
  }, [dispatch, id]);

  useEffect(() => {
    callBack();
  }, [callBack]);
  return (
    <Container fixed>
      {loading ? <CircularProgress /> : cocktail &&
        <Box>
          <Box>
            <Box component="img" maxHeight={200} src={ImgUrl} alt="cocktail" />
          </Box>
          <Box>
            <Typography variant="h3">{cocktail.name}</Typography>
            <Typography variant="h4">Ingredients:</Typography>
            <List>
              {cocktail.ingredients.map(el => <ListItem key={Math.random()}>
                <Typography>{el.name} ... {el.amount}</Typography>
              </ListItem>)}
            </List>
          </Box>
          <Box>
            <Typography variant="h4">Recipe</Typography>
            <Typography>{cocktail.recipe}</Typography>
          </Box>
        </Box>}
    </Container>
  );
};

export default OneCocktailPage;