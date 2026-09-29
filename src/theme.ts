'use client';
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2f57db',
      light: '#3b82f6',
      dark: '#1e3a8a',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#44dccf',
      light: '#14b8a6',
      dark: '#0f766e',
      contrastText: '#ffffff',
    },
    background: {
      default: '#1c1e20',
      paper: '#121212',
    },
    text: {
      primary: '#e0e2e5', 
      secondary: '#7e94b4', 
    },
    success: {
      main: '#15803d',
      light: '#f0fdf4',
      contrastText: '#f0fdf4',
    },
    error: {
      main: '#b91c1c',
      light: '#fef2f2',
      contrastText: '#fef2f2',
    },
    divider: '#1e3a8a',
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h4: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
      color: '#2f57db',
    },
    h6: {
      fontWeight: 600,
      lineHeight: 1.5,
      color: '#2f57db',
    },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.07), 0 1px 2px -1px rgb(0 0 0 / 0.07)',
          border: '1px solid #1e3a8a',
        },
      },
    },
  },
});