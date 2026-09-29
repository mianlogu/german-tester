'use client';
import { useState } from 'react';
import { Container, Card, CardContent, Typography, TextField, Button, Box, Stack } from '@mui/material';
import Link from 'next/link';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Registration:', { name, email, password });
  };

  return (
    <Container maxWidth="xs" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Card sx={{ width: '100%', p: 2, border: 1, borderColor: 'divider' }}>
        <CardContent>
          <Typography variant="h5" fontWeight="bold" align="center" gutterBottom>
            Create Account
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Start saving your quiz results and AI teacher chats.
          </Typography>

          <Box component="form" onSubmit={handleRegister}>
            <Stack spacing={2}>
              <TextField
                label="Full Name"
                fullWidth
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <TextField
                label="Email"
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
                Register
              </Button>
            </Stack>
          </Box>

          <Typography variant="body2" align="center" sx={{ mt: 3 }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: '#1976d2', textDecoration: 'none' }}>
              Log In
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}