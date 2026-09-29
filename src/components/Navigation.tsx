'use client';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import Link from 'next/link';

export default function Navigation() {
  return (
    <AppBar position="static" color="transparent" sx={{
      backgroundColor: 'background.paper',
    }} elevation={1}>
      <Container maxWidth="xl"  sx={{ height: 'max-content', py: 2 }}>
        <Toolbar disableGutters sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography
            variant="h3"
            component={Link}
            href="/"
            sx={{ textDecoration: 'none', color: 'primary.main', fontWeight: 'bold' }}
          >
            DeutschPrüfung AI
          </Typography>

          <Box sx={{ display: 'flex', gap: 4, alignItems: 'center', fontSize: '2rem' }}>
            <Button component={Link} href="/" color="inherit" size="large" sx={{ fontSize: '1.5rem' }}>
              Tests
            </Button>
            <Button component={Link} href="/history" color="inherit" size="large" sx={{ fontSize: '1.5rem' }}>
              History & Scores
            </Button>
            <Button component={Link} href="/login" variant="outlined" size="large" sx={{ fontSize: '1.5rem' }}>
              Log In
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}