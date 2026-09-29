'use client';
import { LevelCard } from '@/types/quiz';
import { Container, Typography, Grid, Card, CardContent, CardActions, Button, Chip, Box } from '@mui/material';
import Link from 'next/link';


const CEFR_DATA: LevelCard[] = [
  { level: 'A1', title: 'Beginner', description: 'Basic expressions, introductions, present tense conjugation, and simple syntax.', tags: ['Nominativ', 'Präsens', 'W-Fragen'] },
  { level: 'A2', title: 'Elementary', description: 'Routine tasks, separable verbs, past tense (Perfekt), and basic modal verbs.', tags: ['Perfekt', 'Akkusativ', 'Modalverben'] },
  { level: 'B1', title: 'Intermediate', description: 'Express opinions, reasons, subordinate clauses (weil, dass, wenn), and two-way prepositions.', tags: ['Dativ', 'Wechselpräpositionen', 'Nebensätze'] },
  { level: 'B2', title: 'Vantage', description: 'Complex texts, passive voice, relative clauses, and subjunctive II conditional forms.', tags: ['Passiv', 'Konjunktiv II', 'Relativsätze'] },
  { level: 'C1', title: 'Advanced', description: 'Idiomatic structures, Partizipialattribute, Subjunktiv I, and formal stylistic devices.', tags: ['Nomen-Verb-Verbindungen', 'Partizipialkonstruktionen'] },
  { level: 'C2', title: 'Mastery', description: 'Subtle nuances, complex academic phrasing, historical prose, and near-native grammar precision.', tags: ['Stilistik', 'Nuancen', 'Akademisch'] },
];

export default function DashboardPage() {
  return (
    <>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography variant="h3" component="h1" sx={{
              fontWeight: "bold"
            }}  gutterBottom>
            German Level Assessment
          </Typography>
          <Typography variant="h5" color="text.secondary">
            Select a target CEFR benchmark to generate a real-time diagnostic test powered by Gemini.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {CEFR_DATA.map((item) => (
            <Grid size={{ xs: 14, sm: 8, md: 6 }} key={item.level}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', border: 1, borderColor: 'divider' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h3" component="h2" color="primary" sx={{
                      fontWeight: "bold"
                    }} >
                      {item.level}
                    </Typography>
                    <Chip label={item.title} size="small" variant="outlined" sx={{ fontSize: '1rem' }} />
                  </Box>
                  <Typography variant="subtitle1" component="p" color="text.secondary">
                    {item.description}
                  </Typography>
                  <Box sx={{ display: 'flex', marginTop: 2, gap: 1, flexWrap: 'wrap' }}>
                    {item.tags.map((t) => (
                      <Chip key={t} label={t} size="medium" variant="outlined" sx={{ borderColor: 'primary.main', fontSize: '1rem' }}/>
                    ))}
                  </Box>
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button
                    component={Link}
                    href={`/test/${item.level}`}
                    variant="contained"
                    fullWidth
                  >
                    Start {item.level} Test
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}