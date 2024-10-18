import { useCallback, useEffect } from 'react';
import { CircularProgress, Container, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import CocktailCard from './components/CocktailCard';
import { selectStateOfCocktails, selectStatusOfCocktails } from './CocktailsSlice.ts';
import { getCocktails } from './CocktailThunks.ts';

const CocktailsPage = () => {
  const dispatch = useAppDispatch();
  const cocktail = useAppSelector(selectStateOfCocktails);
  const loading = useAppSelector(selectStatusOfCocktails);

  const callBack = useCallback(async () => {
    await dispatch(getCocktails());
  }, [dispatch]);

  useEffect(() => {
    callBack();
  }, [callBack]);

  return (
    <Container fixed>
      {cocktail.length ? <>
          <Typography textAlign="left" variant="h2">
            Cocktails
          </Typography>
          <Container sx={{ display: 'flex', gap: 5, marginTop: '100px' }}>
            {loading ? <CircularProgress /> : cocktail.map((el) => <CocktailCard key={Math.random()} cocktail={el} />)}
          </Container>
        </> :
        <Typography textAlign="center" variant="h2">There is no cocktails yet</Typography>
      }
    </Container>
  );
};

export default CocktailsPage;