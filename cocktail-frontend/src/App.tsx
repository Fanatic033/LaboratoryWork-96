import ResponsiveAppBar from './UI/Header/AppToolBar.tsx';
import { Route, Routes } from 'react-router-dom';
import Register from './features/User/Register.tsx';
import Login from './features/User/Login.tsx';
import { Typography } from '@mui/material';
import CocktailPage from './features/Cocktail/CocktailPage.tsx';
import CocktailForm from './features/Cocktail/components/CocktailForm.tsx';

const App = () => {
  return (
    <>
      <header>
        <ResponsiveAppBar />
      </header>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path={'/login'} element={<Login />} />
        <Route path={'/'} element={<CocktailPage />} />
        <Route path={'new-cocktail'} element={<CocktailForm />} />
        <Route
          path="*"
          element={<Typography variant="h1">Not found</Typography>}
        />
      </Routes>
    </>
  );
};

export default App;