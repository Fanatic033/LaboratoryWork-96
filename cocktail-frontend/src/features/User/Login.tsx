import React, {useState} from 'react';
import {Alert, Avatar, Box, Link, TextField, Typography} from '@mui/material';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import {Link as RouterLink, useNavigate} from 'react-router-dom';
import {useAppDispatch, useAppSelector} from '../../app/hooks.ts';
import {GoogleLogin} from '@react-oauth/google';
import {LoadingButton} from '@mui/lab';
import {selectLoginError, selectLoginLoading} from './userSlice.ts';
import {googleLogin, login} from './userThunks.ts';

const Login = () => {
  const dispatch = useAppDispatch();
  const error = useAppSelector(selectLoginError);
  const btnLoading = useAppSelector(selectLoginLoading);

  const navigate = useNavigate();

  const [state, setState] = useState({
    email: '',
    password: '',
  });

  const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = event.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const submitFormHandler = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await dispatch(login(state)).unwrap();
      navigate('/');
    } catch (e) {
      console.error(e);
    }
  };

  const googleLoginHandler = async (credential: string) => {
    await dispatch(googleLogin(credential)).unwrap();
    navigate('/')
  };

  return (
    <Box
      sx={{
        mt: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: 'white',
        width: '600px',
        height: '700px',
        borderRadius: '3%',
        margin: '50px auto',
      }}
    >
      <Avatar sx={{m: 7, bgcolor: 'success.main'}}>
        <LockOpenIcon/>
      </Avatar>
      <Typography component="h1" variant="h5">
        Войти в Spotify
      </Typography>
      {error && (
        <Alert severity="error" sx={{mt: 3}}>
          {error.error}
        </Alert>
      )}
      <Box sx={{pt: 2}}>
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            if (credentialResponse.credential) {
              void googleLoginHandler(credentialResponse.credential);
            }
            console.log(credentialResponse);
          }}
          onError={() => {
            console.log('Login Failed');
          }}
        />
      </Box>
      <Box
        component="form"
        onSubmit={submitFormHandler}
        sx={{
          mt: 3,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Box sx={{width: '100%', maxWidth: 400, mt: 2}}>
          <TextField
            required
            label="Email"
            name="email"
            autoComplete="current-email"
            value={state.email}
            onChange={inputChangeHandler}
            fullWidth
            margin="normal"
          />
          <TextField
            required
            type="password"
            label="Password"
            name="password"
            autoComplete="new-password"
            value={state.password}
            fullWidth
            onChange={inputChangeHandler}
            margin="normal"
          />
        </Box>
        <LoadingButton
          type="submit"
          fullWidth
          variant="contained"
          sx={{mt: 3, mb: 2}}
          loading={btnLoading ? false : undefined}
        >
          Войти
        </LoadingButton>
        <Link
          component={RouterLink}
          to={'/register'}
          variant="body2"
          sx={{textDecoration: 'none'}}
        >
          <span style={{color: 'gray'}}>Нет аккаунта?</span> Регистрация в
          Spotify
        </Link>
      </Box>
    </Box>
  );
};

export default Login