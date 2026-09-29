'use client';

import { use, useEffect, useState } from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormGroup,
  Checkbox,
  TextField,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Stack,
  Chip,
  Divider,
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import Link from 'next/link';
import { CEFRLevel, Question } from '@/types/quiz';
import { fetchQuiz, askTutor } from '@/services/api';
import { saveTestResult } from '@/services/storage';

const VALID_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const QUICK_PROMPTS = [
  'Why is this grammatical case used here?',
  'Explain the verb position / word order rule.',
  'Can you give me 2 more example sentences like this?',
  'What is the difference between this and the other options?',
];

export default function TestPage({ params }: { params: Promise<{ level: string }> }) {
  const resolvedParams = use(params);
  const rawLevel = resolvedParams.level.toUpperCase() as CEFRLevel;
  const level = VALID_LEVELS.includes(rawLevel as CEFRLevel)
  ? (rawLevel as CEFRLevel)
  : null;

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  const [answers, setAnswers] = useState<Record<number, string[]>>({});
  const [submitted, setSubmitted] = useState<Record<number, boolean>>({});
  const [finished, setFinished] = useState(false);

  // Tutor modal states
  const [openTutor, setOpenTutor] = useState(false);
  const [tutorQuery, setTutorQuery] = useState('');
  const [tutorHistory, setTutorHistory] = useState<Record<number, { query: string; reply: string }[]>>({});
  const [tutorLoading, setTutorLoading] = useState(false);

useEffect(() => {
  if (!level) {
    setError(`"${rawLevel}" is not a recognized CEFR level.`);
    setLoading(false);
    return;
  }

  // AbortController cancels the first request when StrictMode unmounts/remounts
  const controller = new AbortController();
  let isMounted = true;

  setLoading(true);
  setError('');

  fetchQuiz(level, 10, controller.signal)
    .then((data) => {
      if (isMounted) setQuestions(data);
    })
    .catch((err) => {
      if (err.name === 'AbortError') return; // Ignore intentional abort
      if (isMounted) setError('Failed to generate test. Check your Gemini API connection.');
    })
    .finally(() => {
      if (isMounted) setLoading(false);
    });

  return () => {
    isMounted = false;
    controller.abort(); // Cancels the duplicate development call
  };
}, [level, rawLevel]);

  const currentQ = questions[currentIndex];
  const currentAnswer = answers[currentIndex] || [];
  const isSubmitted = submitted[currentIndex] || false;
  const currentTutorThread = tutorHistory[currentIndex] || [];

  const isCurrentCorrect = () => {
    if (!currentQ || !isSubmitted) return false;
    const sortedUser = [...currentAnswer].map((s) => s.trim()).sort();
    const sortedExpected = [...currentQ.correctAnswers].map((s) => s.trim()).sort();
    switch (currentQ.type) {
      case 'fill_in_blank': {
        console.log(sortedExpected);
        console.log(sortedUser[0]);
        return sortedExpected.includes(sortedUser[0]);
      }
      case 'multiple_choice': {
        return (
          sortedUser.length === sortedExpected.length &&
          sortedUser.every((val, i) => val === sortedExpected[i])
        );
      }
      case 'single_choice': {
        return sortedExpected[0] === sortedUser[0];
      }
      default: {
        return (
          sortedUser.length === sortedExpected.length &&
          sortedUser.every((val, i) => val === sortedExpected[i])
        );
      }
    }
    
  };

  const handleNext = () => {
    console.log(isCurrentCorrect);
    setTimeout(isCurrentCorrect, 1000);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      let totalCorrect = 0;
      questions.forEach((q, idx) => {
        const u = [...(answers[idx] || [])].map((s) => s.trim().toLowerCase()).sort();
        const c = [...q.correctAnswers].map((s) => s.trim().toLowerCase()).sort();
        if (u.length === c.length && u.every((val, i) => val === c[i])) {
          totalCorrect += 1;
        }
      });
      if (level) {
        saveTestResult({
          level,
          score: totalCorrect,
          totalQuestions: questions.length,
          questions,
          userAnswers: answers,
        });
      }
      setFinished(true);
    }
  };
  
  const handleSendTutorQuery = async (customQuery?: string) => {
    const queryToSend = customQuery || tutorQuery;
    if (!queryToSend.trim()) return;

    setTutorLoading(true);
    try {
      const reply = await askTutor({
        question: currentQ.question,
        userAnswer: currentAnswer.join(', ') || '(None chosen)',
        correctAnswer: currentQ.correctAnswers.join(', '),
        initialExplanation: currentQ.explanation,
        userQuery: queryToSend,
      });

      setTutorHistory((prev) => ({
        ...prev,
        [currentIndex]: [...(prev[currentIndex] || []), { query: queryToSend, reply }],
      }));
      setTutorQuery('');
    } catch {
      setTutorHistory((prev) => ({
        ...prev,
        [currentIndex]: [
          ...(prev[currentIndex] || []),
          { query: queryToSend, reply: 'Could not connect to the tutor service.' },
        ],
      }));
    } finally {
      setTutorLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ py: 12, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }} color="text.secondary">
          Generating {level} proficiency test with Gemini...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Alert severity="error">{error}</Alert>
        <Button component={Link} href="/" sx={{ mt: 2 }}>
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  if (finished) {
    return (
      <Container maxWidth="sm" sx={{ py: 10, textAlign: 'center' }}>
        <Card variant="outlined" sx={{ p: 4 }}>
          <Typography variant="h4" sx={{
              fontWeight: "bold"
            }} gutterBottom>
            Test Complete!
          </Typography>
          <Typography color="text.secondary">
            Your results have been recorded in your score history.
          </Typography>
          <Stack direction="row" spacing={2} sx={{ justifyContent: 'center', mt: 3 }}>
            <Button variant="contained" component={Link} href="/history">
              View Score History
            </Button>
            <Button variant="outlined" component={Link} href="/">
              Take Another Test
            </Button>
          </Stack>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Card sx={{ border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', overflow: 'hidden' }}>
        {/* Progress Header */}
        <Box sx={{ px: 3, py: 2, bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
          <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 600, color: 'text.secondary' }}>
              Question {currentIndex + 1} of {questions.length} • Level {level}
            </Typography>
            <Chip
              label={currentQ.type.replace('_', ' ').toUpperCase()}
              size="medium"
              variant='outlined'
              sx={{
                fontWeight: 'bold',
                fontSize: '1rem',
                color: 'text.primary',
              }}
            />
          </Stack>
          <LinearProgress
            variant="determinate"
            value={((currentIndex + 1) / questions.length) * 100}
            sx={{
              mt: 1.5,
              height: 6,
              borderRadius: 3,
              bgcolor: '#cbd5e1',
              '& .MuiLinearProgress-bar': { bgcolor: 'secondary.main', borderRadius: 3 },
            }}
          />
        </Box>

        <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
          {/* Question Text */}
          <Typography
            variant="h6"
            sx={{
              fontSize: '1.25rem',
              fontWeight: 600,
              color: 'text.secondary',
              mb: 3,
              lineHeight: 1.6,
            }}
          >
            {currentQ.question}
          </Typography>

          {/* Choice Options rendered as interactive blocks */}
          <Box sx={{ my: 3 }}>
            {/* 1. Single Choice */}
            {currentQ.type === 'single_choice' && (
              <RadioGroup
                value={currentAnswer[0] || ''}
                onChange={(e) => setAnswers({ ...answers, [currentIndex]: [e.target.value] })}
              >
                <Stack spacing={1.5}>
                  {currentQ.options.map((opt, i) => {
                    const isSelected = currentAnswer[0] === opt;
                    return (
                      <Box
                        key={i}
                        sx={{
                          border: '1.5px solid',
                          borderColor: isSelected ? 'primary.main' : 'divider',
                          bgcolor: isSelected ? 'background.default' : 'background.paper',
                          borderRadius: 2,
                          px: 2,
                          py: 1,
                          transition: 'all 0.15s ease-in-out',
                          '&:hover': {
                            borderColor: !isSubmitted ? 'secondary.main' : undefined,
                            bgcolor: !isSubmitted ? 'background.default' : undefined,
                          },
                        }}
                      >
                        <FormControlLabel
                          value={opt}
                          control={<Radio color="primary" />}
                          label={
                            <Typography sx={{ fontWeight: isSelected ? 600 : 400, fontSize: isSelected ? '1.25rem' : '1rem', color: 'text.primary' }}>
                              {opt}
                            </Typography>
                          }
                          disabled={isSubmitted}
                          sx={{ width: '100%', m: 0 }}
                        />
                      </Box>
                    );
                  })}
                </Stack>
              </RadioGroup>
            )}

            {/* 2. Multiple Choice */}
            {currentQ.type === 'multiple_choice' && (
              <FormGroup>
                <Stack spacing={1.5}>
                  {currentQ.options.map((opt, i) => {
                    const isSelected = currentAnswer.includes(opt);
                    return (
                      <Box
                        key={i}
                        sx={{
                          border: '1.5px solid',
                          borderColor: isSelected ? 'primary.main' : 'divider',
                          bgcolor: isSelected ? 'background.default' : 'background.paper',
                          borderRadius: 2,
                          px: 2,
                          py: 1,
                          transition: 'all 0.15s ease-in-out',
                          '&:hover': {
                            borderColor: !isSubmitted ? 'secondary.main' : undefined,
                            bgcolor: !isSubmitted ? 'background.default' : undefined,
                          },
                        }}
                      >
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={isSelected}
                              onChange={() => {
                                const exist = currentAnswer.includes(opt);
                                const next = exist
                                  ? currentAnswer.filter((x) => x !== opt)
                                  : [...currentAnswer, opt];
                                setAnswers({ ...answers, [currentIndex]: next });
                              }}
                              disabled={isSubmitted}
                            />
                          }
                          label={
                            <Typography sx={{ fontWeight: isSelected ? 600 : 400, fontSize: isSelected ? '1.25rem' : '1rem', color: 'text.primary' }}>
                              {opt}
                            </Typography>
                          }
                          sx={{ width: '100%', m: 0 }}
                        />
                      </Box>
                    );
                  })}
                </Stack>
              </FormGroup>
            )}

            {/* 3. Fill in the Blank */}
            {currentQ.type === 'fill_in_blank' && (
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Antwort hier eingeben..."
                value={currentAnswer[0] || ''}
                onChange={(e) => setAnswers({ ...answers, [currentIndex]: [e.target.value] })}
                disabled={isSubmitted}
                sx={{
                  bgcolor: 'background.paper',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    // 1. Default idle border
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#cbd5e1', // Slate 300
                      borderWidth: '1.5px',
                    },
                    // 2. Hover state
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'secondary.main', // Slate 400
                    },
                    // 3. Focused state
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main', // Primary brand color
                      borderWidth: '2px',
                    },
                    // 4. Disabled state (e.g. after verifying answer)
                    '&.Mui-disabled .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#e2e8f0',
                      color: '#e2e8f0',
                    },
                    '&.Mui-disabled .MuiOutlinedInput-input': {
                      color: '#e2e8f0',
                      WebkitTextFillColor: '#e2e8f0',
                    },
                  },
                  // Optional: Label color transitions when focused
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#1e40af',
                  },
                  
                }}
              />
            )}
          </Box>

          {/* Post-submission Feedback Panel */}
          {isSubmitted && (
            <Box sx={{ mt: 3 }}>
              <Alert
                severity={isCurrentCorrect() ? 'success' : 'error'}
                sx={{
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: isCurrentCorrect() ? 'success.main' : 'error.main',
                  bgcolor: 'background.default',
                  '& .MuiAlert-message': { color: isCurrentCorrect() ? 'success.main' : 'error.main' },
                }}
              >
                <Typography variant="h4" sx={{ fontWeight: 700, fontSize: '1.25rem' }}>
                  {isCurrentCorrect() ? '✓ Richtig!' : '✗ Falsch!'}
                </Typography>
                {!isCurrentCorrect() && (
                  <Typography variant="body1" sx={{ mt: 0.5, color: 'error.main', fontWeight: 600 }}>
                    Expected answer: {currentQ.correctAnswers.join(' / ')}
                  </Typography>
                )}
                <Typography variant="body1" sx={{ mt: 1, color: 'text.primary', lineHeight: 1.6 }}>
                  {currentQ.explanation}
                </Typography>
              </Alert>
              <Button
                size="small"
                variant="outlined"
                color="secondary"
                startIcon={<SchoolIcon />}
                onClick={() => setOpenTutor(true)}
                sx={{ mt: 2 }}
              >
                Ask Tutor for Clarification
              </Button>
            </Box>
          )}

          {/* Action Buttons */}
          <Stack direction="row" spacing={2} sx={{ mt: 4, pt: 2, borderTop: '1px solid #f1f5f9' }}>
            {!isSubmitted ? (
              <Button
                variant="contained"
                size="large"
                onClick={() => setSubmitted({ ...submitted, [currentIndex]: true })}
                disabled={currentAnswer.length === 0}
                sx={{ px: 4 }}
              >
                Verify
              </Button>
            ) : (
              <Button variant="contained" size="large" onClick={handleNext} sx={{ px: 4 }}>
                {currentIndex === questions.length - 1 ? 'Finish Test' : 'Next Question'}
              </Button>
            )}
            <Button
              variant="outlined"
              color="inherit"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((i) => i - 1)}
              sx={{ color: 'text.secondary' }}
            >
              Previous
            </Button>
          </Stack>
        </CardContent>
      </Card>
      {/* Upgraded Tutor Clarification Modal */}
      <Dialog
        open={openTutor}
        onClose={() => setOpenTutor(false)}
        maxWidth="sm"
        fullWidth
        scroll="paper"
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <SchoolIcon color="secondary" />
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              German Tutor • Question {currentIndex + 1}
            </Typography>
          </Stack>
          <Typography variant="caption" color="text.secondary">
            Get personalized explanations and grammar rules directly from Gemini.
          </Typography>
        </DialogTitle>

        <DialogContent dividers sx={{ p: 3 }}>
          {/* Question Summary Banner inside Modal */}
          <Box sx={{ p: 2, mb: 2.5, bgcolor: 'background.default', borderRadius: 2, border: '1px solid', borderColor: 'primary.main' }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', mb: 0.5 }}>
              &quot;{currentQ.question}&quot;
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your answer: <strong>{currentAnswer.join(', ') || '(None)'}</strong> | Expected:{' '}
              <strong style={{ color: '#15803d' }}>{currentQ.correctAnswers.join(' / ')}</strong>
            </Typography>
          </Box>

          {/* Quick Prompts */}
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, display: 'block', mb: 1 }}>
            Quick Prompts:
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', mb: 3 }}>
            {QUICK_PROMPTS.map((qp, idx) => (
              <Chip
                key={idx}
                label={qp}
                size="medium"
                onClick={() => handleSendTutorQuery(qp)}
                disabled={tutorLoading}
                sx={{
                  cursor: 'pointer',
                  border: '1px solid',
                  borderColor: 'primary.main',
                  fontSize: '0.75rem',
                  bgcolor: 'background.default',
                  '&:hover': { bgcolor: 'background.paper' },
                }}
              />
            ))}
          </Box>

          {/* Previous Tutor Answers Thread */}
          {currentTutorThread.length > 0 && (
            <Stack spacing={2} sx={{ mb: 3 }}>
              {currentTutorThread.map((item, idx) => (
                <Box
                  key={idx}
                  sx={{
                    p: 2,
                    bgcolor: '#f0fdf4',
                    borderRadius: 2,
                    border: '1px solid #bbf7d0',
                  }}
                >
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#166534', display: 'block', mb: 0.5 }}>
                    Q: {item.query}
                  </Typography>
                  <Divider sx={{ my: 1, borderColor: '#dcfce7' }} />
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-line', color: '#14532d', lineHeight: 1.6 }}>
                    {item.reply}
                  </Typography>
                </Box>
              ))}
            </Stack>
          )}

          {tutorLoading && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 3 }}>
              <CircularProgress size={28} />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                Thinking through the grammar explanation...
              </Typography>
            </Box>
          )}

          {/* Custom Input */}
          <TextField
            autoFocus
            fullWidth
            multiline
            rows={2}
            label="Ask custom question"
            placeholder="e.g. Why is the adjective ending -en and not -es?"
            value={tutorQuery}
            onChange={(e) => setTutorQuery(e.target.value)}
            disabled={tutorLoading}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                // 1. Default idle border
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#cbd5e1', // Slate 300
                  borderWidth: '1.5px',
                },
                // 2. Hover state
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'secondary.main', // Slate 400
                },
                // 3. Focused state
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'primary.main', // Primary brand color
                  borderWidth: '2px',
                },
                // 4. Disabled state (e.g. after verifying answer)
                '&.Mui-disabled .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#e2e8f0',
                  color: '#e2e8f0',
                },
                '&.Mui-disabled .MuiOutlinedInput-input': {
                  color: '#e2e8f0',
                  WebkitTextFillColor: '#e2e8f0',
                },
              },
              // Optional: Label color transitions when focused
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#1e40af',
              },
            }}
          />
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenTutor(false)} color="inherit">
            Close
          </Button>
          <Button
            onClick={() => handleSendTutorQuery()}
            variant="contained"
            disabled={tutorLoading || !tutorQuery.trim()}
          >
            Ask Tutor
          </Button>
        </DialogActions>
      </Dialog>
      
    </Container>
  );
}