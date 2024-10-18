import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { addInterceptors } from './axiosApi.ts';
import { persistor, store } from './app/store.ts';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GOOGLE_CLIENT_ID } from './constants.ts';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import theme from './theme.ts';

addInterceptors(store);

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <BrowserRouter>
          <ThemeProvider theme={theme} />
          <CssBaseline />
          <App />
        </BrowserRouter>
      </GoogleOAuthProvider>
    </PersistGate>
  </Provider>,
);
