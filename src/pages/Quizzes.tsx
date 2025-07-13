import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Quiz as QuizIcon,
  AutoAwesome,
  CheckCircle,
  Cancel,
  ArrowBack,
  Timer,
  Grade,
  RestartAlt,
  Delete
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useStore } from '../store';
import { GeminiService } from '../services/gemini';
import type { Quiz, Question } from '../types';

interface QuizSessionState {
  currentQuestionIndex: number;
  userAnswers: { [questionId: string]: number };
  isCompleted: boolean;
  score: number;
}

export const Quizzes: React.FC = () => {
  const navigate = useNavigate();
  const { quizzes, addQuiz, updateQuiz, deleteQuiz } = useStore();
  const [topic, setTopic] = useState('');
  const [notes, setNotes] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [quizSession, setQuizSession] = useState<QuizSessionState | null>(null);
  const [showExplanations, setShowExplanations] = useState(false);

  const handleGenerateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsGenerating(true);
    try {
      const quiz = await GeminiService.generateQuiz(topic, notes);
      addQuiz(quiz);
      toast.success('Quiz generated successfully!');
      setTopic('');
      setNotes('');
    } catch (error) {
      console.error('Error generating quiz:', error);
      toast.error('Failed to generate quiz. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const startQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setQuizSession({
      currentQuestionIndex: 0,
      userAnswers: {},
      isCompleted: false,
      score: 0
    });
    setShowExplanations(false);
  };

  const handleAnswer = (questionId: string, answerIndex: number) => {
    if (!quizSession || quizSession.isCompleted) return;

    setQuizSession({
      ...quizSession,
      userAnswers: {
        ...quizSession.userAnswers,
        [questionId]: answerIndex
      }
    });
  };

  const nextQuestion = () => {
    if (!activeQuiz || !quizSession) return;

    const currentQuestion = activeQuiz.questions[quizSession.currentQuestionIndex];
    if (!(currentQuestion.id in quizSession.userAnswers)) {
      toast.error('Please select an answer before continuing');
      return;
    }

    if (quizSession.currentQuestionIndex < activeQuiz.questions.length - 1) {
      setQuizSession({
        ...quizSession,
        currentQuestionIndex: quizSession.currentQuestionIndex + 1
      });
    } else {
      completeQuiz();
    }
  };

  const completeQuiz = () => {
    if (!activeQuiz || !quizSession) return;

    let score = 0;
    activeQuiz.questions.forEach((question) => {
      if (quizSession.userAnswers[question.id] === question.correctAnswer) {
        score++;
      }
    });

    const percentage = Math.round((score / activeQuiz.questions.length) * 100);

    setQuizSession({
      ...quizSession,
      isCompleted: true,
      score: percentage
    });

    updateQuiz(activeQuiz.id, {
      score: percentage,
      completedAt: new Date()
    });

    toast.success(`Quiz completed! Score: ${percentage}%`);
  };

  const closeQuiz = () => {
    setActiveQuiz(null);
    setQuizSession(null);
    setShowExplanations(false);
  };

  const restartQuiz = () => {
    if (!activeQuiz) return;
    startQuiz(activeQuiz);
  };

  if (activeQuiz && quizSession) {
    const currentQuestion = activeQuiz.questions[quizSession.currentQuestionIndex];
    const isLastQuestion = quizSession.currentQuestionIndex === activeQuiz.questions.length - 1;

    return (
      <div className="min-h-screen bg-md-sys-color-background">
        <header className="sticky top-0 z-30 bg-md-sys-color-surface shadow-elevation-1">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="text"
                  icon={<ArrowBack />}
                  onClick={closeQuiz}
                  className="!p-2"
                />
                <h1 className="text-xl font-medium text-md-sys-color-on-surface">
                  {activeQuiz.topic}
                </h1>
              </div>
              <span className="text-sm text-md-sys-color-on-surface-variant">
                Question {quizSession.currentQuestionIndex + 1} of {activeQuiz.questions.length}
              </span>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6 max-w-3xl">
          {!quizSession.isCompleted ? (
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card variant="elevated" className="mb-6">
                <h2 className="text-xl font-medium text-md-sys-color-on-surface mb-6">
                  {currentQuestion.question}
                </h2>

                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => {
                    const isSelected = quizSession.userAnswers[currentQuestion.id] === index;
                    
                    return (
                      <button
                        key={index}
                        onClick={() => handleAnswer(currentQuestion.id, index)}
                        className={`
                          w-full text-left p-4 rounded-lg border-2 transition-all
                          ${isSelected
                            ? 'border-md-sys-color-primary bg-md-sys-color-primary-container'
                            : 'border-md-sys-color-outline hover:border-md-sys-color-primary hover:bg-md-sys-color-surface-variant'
                          }
                        `}
                      >
                        <div className="flex items-start gap-3">
                          <span className={`
                            flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                            ${isSelected
                              ? 'bg-md-sys-color-primary text-md-sys-color-on-primary'
                              : 'bg-md-sys-color-surface-variant text-md-sys-color-on-surface-variant'
                            }
                          `}>
                            {String.fromCharCode(65 + index)}
                          </span>
                          <span className="text-md-sys-color-on-surface">
                            {option}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-end mt-6">
                  <Button
                    variant="filled"
                    onClick={nextQuestion}
                  >
                    {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
                  </Button>
                </div>
              </Card>
            </motion.div>
          ) : (
            <Card variant="elevated">
              <div className="text-center py-8">
                <div className="w-32 h-32 mx-auto mb-6 relative">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="60"
                      stroke="var(--md-sys-color-surface-variant)"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="60"
                      stroke="var(--md-sys-color-primary)"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${(quizSession.score / 100) * 377} 377`}
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold text-md-sys-color-primary">
                      {quizSession.score}%
                    </span>
                  </div>
                </div>

                <h2 className="text-2xl font-medium text-md-sys-color-on-surface mb-2">
                  Quiz Completed!
                </h2>
                <p className="text-md-sys-color-on-surface-variant mb-6">
                  You got {activeQuiz.questions.filter(q => 
                    quizSession.userAnswers[q.id] === q.correctAnswer
                  ).length} out of {activeQuiz.questions.length} questions correct
                </p>

                <div className="flex justify-center gap-3 mb-6">
                  <Button
                    variant="outlined"
                    icon={<RestartAlt />}
                    onClick={restartQuiz}
                  >
                    Retake Quiz
                  </Button>
                  <Button
                    variant="filled"
                    onClick={() => setShowExplanations(!showExplanations)}
                  >
                    {showExplanations ? 'Hide' : 'Show'} Answers
                  </Button>
                </div>

                {showExplanations && (
                  <div className="space-y-4 mt-8 text-left">
                    {activeQuiz.questions.map((question, index) => {
                      const userAnswer = quizSession.userAnswers[question.id];
                      const isCorrect = userAnswer === question.correctAnswer;

                      return (
                        <div key={question.id} className="border-t border-md-sys-color-outline-variant pt-4">
                          <div className="flex items-start gap-2 mb-2">
                            {isCorrect ? (
                              <CheckCircle className="text-md-sys-color-primary mt-1" />
                            ) : (
                              <Cancel className="text-md-sys-color-error mt-1" />
                            )}
                            <div className="flex-1">
                              <p className="font-medium text-md-sys-color-on-surface">
                                {index + 1}. {question.question}
                              </p>
                              <p className="text-sm text-md-sys-color-on-surface-variant mt-2">
                                Your answer: <span className={isCorrect ? 'text-md-sys-color-primary' : 'text-md-sys-color-error'}>
                                  {question.options[userAnswer]}
                                </span>
                              </p>
                              {!isCorrect && (
                                <p className="text-sm text-md-sys-color-primary mt-1">
                                  Correct answer: {question.options[question.correctAnswer]}
                                </p>
                              )}
                              {question.explanation && (
                                <p className="text-sm text-md-sys-color-on-surface-variant mt-2 italic">
                                  {question.explanation}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </Card>
          )}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-md-sys-color-background">
      <header className="sticky top-0 z-30 bg-md-sys-color-surface shadow-elevation-1">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="text"
              icon={<ArrowBack />}
              onClick={() => navigate('/')}
              className="!p-2"
            />
            <h1 className="text-2xl font-medium text-md-sys-color-on-surface">
              Quizzes
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Card variant="elevated" className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <AutoAwesome className="text-md-sys-color-primary" />
            <h2 className="text-lg font-medium text-md-sys-color-on-surface">
              Generate AI Quiz
            </h2>
          </div>
          
          <form onSubmit={handleGenerateQuiz} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-md-sys-color-on-surface mb-2">
                Topic
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., World War II, Python Programming, Biology"
                className="input-outlined"
                required
                disabled={isGenerating}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-md-sys-color-on-surface mb-2">
                Notes (optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Paste your notes here to generate a quiz based on them..."
                className="input-outlined resize-none"
                rows={4}
                disabled={isGenerating}
              />
            </div>
            
            <Button
              type="submit"
              variant="filled"
              icon={<AutoAwesome />}
              disabled={isGenerating}
              className="w-full sm:w-auto"
            >
              {isGenerating ? 'Generating...' : 'Generate Quiz'}
            </Button>
          </form>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {quizzes.map((quiz) => (
              <motion.div
                key={quiz.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -4 }}
              >
                <Card variant="elevated" className="h-full flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-medium text-md-sys-color-on-surface">
                      {quiz.topic}
                    </h3>
                    <Button
                      variant="text"
                      icon={<Delete />}
                      onClick={() => {
                        deleteQuiz(quiz.id);
                        toast.success('Quiz deleted');
                      }}
                      className="!p-2 text-md-sys-color-error"
                    />
                  </div>

                  <div className="flex-1 space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-md-sys-color-on-surface-variant">
                      <QuizIcon className="text-sm" />
                      <span>{quiz.questions.length} questions</span>
                    </div>
                    
                    {quiz.score !== undefined && (
                      <div className="flex items-center gap-2 text-sm">
                        <Grade className="text-sm text-md-sys-color-primary" />
                        <span className="text-md-sys-color-primary font-medium">
                          Last score: {quiz.score}%
                        </span>
                      </div>
                    )}
                    
                    {quiz.completedAt && (
                      <div className="flex items-center gap-2 text-sm text-md-sys-color-on-surface-variant">
                        <Timer className="text-sm" />
                        <span>
                          Completed {new Date(quiz.completedAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>

                  <Button
                    variant="filled"
                    onClick={() => startQuiz(quiz)}
                    className="w-full"
                  >
                    {quiz.score !== undefined ? 'Retake Quiz' : 'Start Quiz'}
                  </Button>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {quizzes.length === 0 && (
          <Card variant="elevated" className="text-center py-12">
            <QuizIcon className="text-6xl text-md-sys-color-primary opacity-20 mb-4" />
            <p className="text-lg text-md-sys-color-on-surface-variant mb-2">
              No quizzes yet
            </p>
            <p className="text-sm text-md-sys-color-on-surface-variant mb-6">
              Generate your first AI-powered quiz to test your knowledge
            </p>
          </Card>
        )}
      </main>
    </div>
  );
};