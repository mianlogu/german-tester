'use client';
import { useState } from 'react';
import { Container, Card, CardContent, Typography, TextField, Button, Box, Divider, Stack } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ready to plug into NextAuth/Auth.js or your standalone auth endpoint
    console.log('Login attempt:', { email, password });
  };

  return (
    <Container maxWidth="xs" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Card sx={{ width: '100%', p: 2, border: 1, borderColor: 'divider' }}>
        <CardContent>
          <Typography variant="h5" fontWeight="bold" align="center" gutterBottom>
            Welcome Back
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Sign in to track your German progress across devices.
          </Typography>

          <Button
            variant="outlined"
            fullWidth
            startIcon={<GoogleIcon />}
            sx={{ mb: 2 }}
            onClick={() => console.log('Trigger Google OAuth')}
          >
            Continue with Google
          </Button>

          <Divider sx={{ my: 2 }}>or</Divider>

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                label="Email Address"
                type="email"
                fullWidth
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                label="Password"
                type="password"
                fullWidth
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" variant="contained" fullWidth size="large">
                Log In
              </Button>
            </Stack>
          </Box>

          <Typography variant="body2" align="center" sx={{ mt: 3 }}>
            Don&apos;t have an account?{' '}
            <Link href="/register" style={{ color: '#1976d2', textDecoration: 'none' }}>
              Register
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}