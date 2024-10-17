import React, {useState} from 'react';
import {Avatar, Box, Link, TextField, Typography} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {Link as NavLink, useNavigate} from 'react-router-dom';
import {useAppDispatch, useAppSelector} from '../../app/hooks.ts';
import {RegisterMutation} from '../../types.ts';
import {LoadingButton} from '@mui/lab';
import {GoogleLogin} from '@react-oauth/google';
import {selectRegisterError, selectRegisterLoading} from './userSlice.ts';
import {googleLogin, register} from './userThunks.ts';
import FileInput from '../../UI/FileInput.tsx';

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const error = useAppSelector(selectRegisterError);
  const btnLoading = useAppSelector(selectRegisterLoading);

  const [state, setState] = useState<RegisterMutation>({
    email: '',
    password: '',
    displayName: '',
    avatar: '',
  });

  const getFieldError = (fieldName: string) => {
    return error?.errors[fieldName]?.message;
  };

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
      await dispatch(register(state)).unwrap();
      navigate('/');
    } catch (e) {
      console.error(e);
    }
  };

  const fileInputChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const {name, files} = event.target;
    const value = files && files[0] ? files[0] : null;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
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
        <LockOutlinedIcon/>
      </Avatar>
      <Typography component="h1" variant="h5">
        Зарегестрироваться
      </Typography>
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
        noValidate
        onSubmit={submitFormHandler}
        sx={{mt: 3}}
      >
        <Box sx={{width: '100%', maxWidth: 400, mt: 2}}>
          <TextField
            required
            label="Email"
            name="email"
            autoComplete="new-email"
            value={state.email}
            onChange={inputChangeHandler}
            fullWidth
            margin="normal"
            error={Boolean(getFieldError('email'))}
            helperText={getFieldError('email')}
          />
          <TextField
            required
            type="text"
            label="DisplayName"
            name="displayName"
            value={state.displayName}
            onChange={inputChangeHandler}
            fullWidth
            margin="normal"
          />
          <FileInput
            label={'Avatar'}
            name={'avatar'}
            onChange={fileInputChangeHandler}
          />
          <TextField
            required
            type="password"
            label="Password"
            name="password"
            autoComplete="new-password"
            value={state.password}
            onChange={inputChangeHandler}
            fullWidth
            margin="normal"
            error={Boolean(getFieldError('password'))}
            helperText={getFieldError('password')}
          />
        </Box>
        <LoadingButton
          type="submit"
          fullWidth
          variant="contained"
          sx={{mt: 3, mb: 2}}
          loading={btnLoading}
        >
          Регистрация
        </LoadingButton>
        <Link
          component={NavLink}
          to={'/login'}
          variant="body2"
          sx={{textDecoration: 'none'}}
        >
          <span style={{color: 'gray'}}>У вас уже есть аккаунт ?</span> Войти
          в Spotify
        </Link>
      </Box>
    </Box>
  );
};

export default Register;