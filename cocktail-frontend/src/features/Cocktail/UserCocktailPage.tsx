import  { useCallback, useEffect } from 'react';
import { CircularProgress, Container, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectStateOfCocktails, selectStatusOfCocktails } from './CocktailsSlice.ts';
import { getCocktailsByAuthor } from './CocktailThunks.ts';
import { selectUser } from '../User/userSlice.ts';
import CocktailCard from './components/CocktailCard.tsx';

const userCocktailPage = () => {
  const dispatch = useAppDispatch();
  const cocktail = useAppSelector(selectStateOfCocktails);
  const loading = useAppSelector(selectStatusOfCocktails);
  const user = useAppSelector(selectUser)!;

  const callBack = useCallback(async () => {
    await dispatch(getCocktailsByAuthor(user._id));
  }, [dispatch, user._id]);


  useEffect(() => {
    callBack();
  }, [callBack]);

  return (
    <Container fixed>
      {cocktail.length ? <>
          <Typography textAlign="center" variant="h2">
            My Cocktails:
          </Typography>
          <Container>
            {loading ? <CircularProgress /> : cocktail.map((el) => <CocktailCard key={Math.random()}
                                                                                 cocktail={el} />)}
          </Container>
        </> :
        <Typography textAlign="center" variant="h2">There is no cocktails</Typography>
      }
    </Container>
  );
};

export default userCocktailPage;