'use client';

import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Divider,
} from '@mui/material';
import Navigation from '@/components/Navigation';
import { getPastResults } from '@/services/storage';
import { TestResult } from '@/types/quiz';

export default function HistoryPage() {
  const [history, setHistory] = useState<TestResult[]>([]);
  const [selectedTest, setSelectedTest] = useState<TestResult | null>(null);

  useEffect(() => {
    setHistory(getPastResults());
  }, []);

  const clearHistory = () => {
    localStorage.removeItem('german_test_history');
    setHistory([]);
    setSelectedTest(null);
  };

  const isAnswerCorrect = (
    userAnswers: string[] = [],
    correctAnswers: string[] = []
  ) => {
    const u = [...userAnswers].map((s) => s.trim().toLowerCase()).sort();
    const c = [...correctAnswers].map((s) => s.trim().toLowerCase()).sort();
    return u.length === c.length && u.every((val, i) => val === c[i]);
  };

  return (
    <>
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <div>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              Test History & Performance
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Click any row to review questions, answers, and explanations.
            </Typography>
          </div>
          {history.length > 0 && (
            <Button color="error" variant="text" size="small" onClick={clearHistory}>
              Clear History
            </Button>
          )}
        </Box>

        {history.length === 0 ? (
          <Card variant="outlined" sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="text.secondary">
              No tests completed yet. Take a test to start tracking your progress!
            </Typography>
          </Card>
        ) : (
          <Card variant="outlined">
            <CardContent sx={{ p: 0 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'background.paper' }}>
                    <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>CEFR Level</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>Score</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>Percentage</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600 }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {history.map((record) => {
                    const pct = Math.round((record.score / record.totalQuestions) * 100);
                    return (
                      <TableRow
                        key={record.id}
                        hover
                        sx={{ cursor: 'pointer', transition: 'background-color 0.15s ease' }}
                        onClick={() => setSelectedTest(record)}
                      >
                        <TableCell>
                          {new Date(record.date).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </TableCell>
                        <TableCell>
                          <Chip label={record.level} size="small" color="primary" sx={{ fontWeight: 600 }} />
                        </TableCell>
                        <TableCell align="right">
                          {record.score} / {record.totalQuestions}
                        </TableCell>
                        <TableCell align="right">
                          <Chip
                            label={`${pct}%`}
                            color={pct >= 70 ? 'success' : pct >= 50 ? 'warning' : 'error'}
                            size="small"
                            sx={{ fontWeight: 600 }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Button size="small" variant="text">
                            Review
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Detailed Review Dialog */}
        <Dialog
          open={Boolean(selectedTest)}
          onClose={() => setSelectedTest(null)}
          maxWidth="md"
          fullWidth
        >
          {selectedTest && (
            <>
              <DialogTitle sx={{ pb: 1 }}>
                <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Test Review • Level {selectedTest.level}
                  </Typography>
                  <Chip
                    label={`Score: ${selectedTest.score} / ${selectedTest.totalQuestions}`}
                    color={
                      selectedTest.score / selectedTest.totalQuestions >= 0.7
                        ? 'success'
                        : 'default'
                    }
                    size="small"
                  />
                </Stack>
                <Typography variant="caption" color="text.secondary">
                  Completed on {new Date(selectedTest.date).toLocaleString()}
                </Typography>
              </DialogTitle>

              <DialogContent dividers sx={{
                p: 3,
                '&::-webkit-scrollbar': {
                  width: '10px',
                },
                '&::-webkit-scrollbar-track': {
                  backgroundColor: 'rgba(241, 239, 233, 0.2)',
                  boxShadow: 'inset 2px 0px 10px 0px rgba(125, 113, 79, 0.2)',
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: (theme) => theme.palette.primary.main,
                  borderRadius: '8px',
                  border: '2px solid transparent',
                  backgroundClip: 'content-box',
                },
                '&::-webkit-scrollbar-thumb:hover': {
                  backgroundColor: (theme) => theme.palette.primary.light,
                },
                '&::-webkit-scrollbar-thumb:active': {
                  backgroundColor: (theme) => theme.palette.primary.dark,
                },
                scrollbarWidth: 'thin',
                scrollbarColor: (theme) => `${theme.palette.primary.main} rgba(241, 239, 233, 0.5)`,
              }}>
                {!selectedTest.questions || selectedTest.questions.length === 0 ? (
                  <Typography color="text.secondary">
                    Detailed question snapshots are not available for this older record.
                  </Typography>
                ) : (
                  <Stack spacing={3} className='overflow-scrollbar'>
                    {selectedTest.questions.map((q, idx) => {
                      const userAns = selectedTest.userAnswers?.[idx] || [];
                      const correct = isAnswerCorrect(userAns, q.correctAnswers);

                      return (
                        <Box
                          key={q.id || idx}
                          sx={{
                            p: 2.5,
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: correct ? 'success.main' : 'error.main',
                            bgcolor: 'background.default',
                          }}
                        >
                          <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                              Question {idx + 1}
                            </Typography>
                            <Chip
                              label={correct ? 'Correct' : 'Incorrect'}
                              size="medium"
                              color={correct ? 'success' : 'error'}
                              sx={{ fontWeight: 600 }}
                            />
                          </Stack>

                          <Typography variant="body1" sx={{ fontWeight: 600, color: 'secondary.main', mb: 2 }}>
                            {q.question}
                          </Typography>

                          <Stack spacing={0.75} sx={{ mb: 2 }}>
                            <Typography variant="body2">
                              <strong>Your answer:</strong>{' '}
                              <span style={{ color: correct ? 'success.main' : 'error.main', fontWeight: 600 }}>
                                {userAns.length > 0 ? userAns.join(', ') : '(No answer provided)'}
                              </span>
                            </Typography>

                            {!correct && (
                              <Typography variant="body2" sx={{ color: 'success.main' }}>
                                <strong>Expected answer:</strong> {q.correctAnswers.join(' / ')}
                              </Typography>
                            )}
                          </Stack>

                          <Divider sx={{ my: 1.5, borderColor: 'divider' }} />

                          <Typography variant="body2" sx={{ color: 'text.primary', fontSize: '0.85rem' }}>
                            <strong>Rule:</strong> {q.explanation}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Stack>
                )}
              </DialogContent>

              <DialogActions sx={{ p: 2 }}>
                <Button onClick={() => setSelectedTest(null)} variant="outlined">
                  Close
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Container>
    </>
  );
}