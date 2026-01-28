import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { mockAssessmentQuestions } from '@/lib/mockData';
import { Target, CheckCircle, XCircle, ArrowRight, RotateCcw, Trophy } from 'lucide-react';

type AssessmentState = 'select' | 'in-progress' | 'completed';

interface AssessmentResult {
  skillName: string;
  correct: number;
  total: number;
  newScore: number;
}

const availableAssessments = [
  { id: '1', skillId: '1', name: 'JavaScript', questions: 2, duration: '5 min' },
  { id: '2', skillId: '3', name: 'React', questions: 2, duration: '5 min' },
  { id: '3', skillId: '5', name: 'System Design', questions: 1, duration: '3 min' },
];

export default function Assessments() {
  const { updateSkillScore, skills } = useApp();
  const [state, setState] = useState<AssessmentState>('select');
  const [selectedAssessment, setSelectedAssessment] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<AssessmentResult | null>(null);

  const assessment = availableAssessments.find((a) => a.id === selectedAssessment);
  const questions = mockAssessmentQuestions.filter((q) => q.skillId === assessment?.skillId);

  const startAssessment = (assessmentId: string) => {
    setSelectedAssessment(assessmentId);
    setCurrentQuestion(0);
    setAnswers([]);
    setResult(null);
    setState('in-progress');
  };

  const selectAnswer = (answerIndex: number) => {
    const newAnswers = [...answers, answerIndex];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 500);
    } else {
      // Calculate results
      const correct = newAnswers.filter(
        (answer, idx) => answer === questions[idx].correctAnswer
      ).length;
      const percentage = Math.round((correct / questions.length) * 100);
      const currentSkill = skills.find((s) => s.id === assessment?.skillId);
      const newScore = Math.min(100, Math.round((currentSkill?.score || 0) * 0.7 + percentage * 0.3));

      setResult({
        skillName: assessment?.name || '',
        correct,
        total: questions.length,
        newScore,
      });

      if (assessment?.skillId) {
        updateSkillScore(assessment.skillId, newScore);
      }

      setTimeout(() => setState('completed'), 500);
    }
  };

  const resetAssessment = () => {
    setState('select');
    setSelectedAssessment(null);
    setCurrentQuestion(0);
    setAnswers([]);
    setResult(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Skill Assessments</h1>
        <p className="text-muted-foreground mt-1">
          Take short assessments to evaluate and improve your skill scores.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {state === 'select' && (
          <motion.div
            key="select"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid md:grid-cols-3 gap-6"
          >
            {availableAssessments.map((assessment) => {
              const skill = skills.find((s) => s.id === assessment.skillId);
              return (
                <Card
                  key={assessment.id}
                  className="hover:border-primary/30 transition-colors cursor-pointer"
                  onClick={() => startAssessment(assessment.id)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                        <Target className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <span className="text-sm text-muted-foreground">{assessment.duration}</span>
                    </div>
                    <CardTitle className="font-display text-xl mt-4">{assessment.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Current Score</span>
                        <span className="font-semibold text-foreground">{skill?.score || 0}%</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Questions</span>
                        <span className="font-semibold text-foreground">{assessment.questions}</span>
                      </div>
                      <Button className="w-full gap-2">
                        Start Assessment <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </motion.div>
        )}

        {state === 'in-progress' && questions.length > 0 && (
          <motion.div
            key="in-progress"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-2xl mx-auto"
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-muted-foreground">
                    Question {currentQuestion + 1} of {questions.length}
                  </span>
                  <span className="text-sm font-medium text-primary">{assessment?.name}</span>
                </div>
                <Progress value={((currentQuestion + 1) / questions.length) * 100} className="h-2" />
              </CardHeader>
              <CardContent className="pt-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentQuestion}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <h2 className="text-xl font-display font-semibold text-foreground">
                      {questions[currentQuestion].question}
                    </h2>
                    <div className="space-y-3">
                      {questions[currentQuestion].options.map((option, index) => {
                        const isSelected = answers[currentQuestion] === index;
                        const isCorrect = index === questions[currentQuestion].correctAnswer;
                        const showResult = answers.length > currentQuestion;

                        return (
                          <motion.button
                            key={index}
                            whileHover={{ scale: showResult ? 1 : 1.02 }}
                            whileTap={{ scale: showResult ? 1 : 0.98 }}
                            onClick={() => !showResult && selectAnswer(index)}
                            disabled={showResult}
                            className={`w-full p-4 rounded-xl border text-left transition-all ${
                              showResult
                                ? isCorrect
                                  ? 'bg-success/10 border-success text-success'
                                  : isSelected
                                  ? 'bg-destructive/10 border-destructive text-destructive'
                                  : 'bg-secondary/50 border-border text-muted-foreground'
                                : 'bg-secondary/50 border-border hover:border-primary/50 hover:bg-primary/5 text-foreground'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span>{option}</span>
                              {showResult && isCorrect && (
                                <CheckCircle className="w-5 h-5 text-success" />
                              )}
                              {showResult && isSelected && !isCorrect && (
                                <XCircle className="w-5 h-5 text-destructive" />
                              )}
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {state === 'completed' && result && (
          <motion.div
            key="completed"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-lg mx-auto"
          >
            <Card className="text-center">
              <CardContent className="pt-8 pb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="w-20 h-20 rounded-full gradient-primary mx-auto flex items-center justify-center mb-6"
                >
                  <Trophy className="w-10 h-10 text-primary-foreground" />
                </motion.div>

                <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                  Assessment Complete!
                </h2>
                <p className="text-muted-foreground mb-8">
                  You answered {result.correct} out of {result.total} questions correctly.
                </p>

                <div className="bg-secondary/50 rounded-xl p-6 mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-muted-foreground">Skill</span>
                    <span className="font-semibold text-foreground">{result.skillName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">New Score</span>
                    <span className="text-2xl font-display font-bold text-primary">
                      {result.newScore}%
                    </span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button variant="outline" onClick={resetAssessment} className="flex-1 gap-2">
                    <RotateCcw className="w-4 h-4" /> Try Another
                  </Button>
                  <Button onClick={resetAssessment} className="flex-1">
                    Done
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
