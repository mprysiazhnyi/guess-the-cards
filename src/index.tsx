import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import 'antd/dist/antd';
import App from './App';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material';

import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  palette: {
    primary: {
      main: '#D97A21', // Lego orange for primary buttons
    },
    secondary: {
      main: '#a76b40', // Soft brown for secondary buttons
    },
    background: {
      default: '#f9f4f0', // Soft beige background
    },
    success: {
      main: '#6cbf6d', // A gentle green success color
      contrastText: '#fff', // Optional: for good contrast with the main color
    },
    error: {
      main: '#f28b82', // Gentle red for danger
      contrastText: '#fff', // Ensures readability
    },
  },
  typography: {
    fontFamily: '"Arial", sans-serif',
  },
});

const root: ReactDOM.Root = ReactDOM.createRoot(
  document.getElementById('app') as HTMLElement
);
const queryClient: QueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});
root.render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </QueryClientProvider>
);
