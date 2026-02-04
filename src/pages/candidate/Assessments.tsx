import { useState, useEffect } from 'react';
import { generateQuizWithAI } from '@/lib/ai';
import { toast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { mockAssessmentQuestions } from '@/lib/mockData';
import { Target, CheckCircle, XCircle, ArrowRight, RotateCcw, Trophy, Loader2 } from 'lucide-react';

type AssessmentState = 'select' | 'generating' | 'in-progress' | 'completed';

interface AssessmentResult {
  skillName: string;
  correct: number;
  total: number;
  newScore: number;
}

export default function Assessments() {
  const { updateSkillScore, skills } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [state, setState] = useState<AssessmentState>('select');
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<AssessmentResult | null>(null);

  // Filter skills that need assessment
  const pendingSkills = skills.filter(s => s.status === 'pending' || s.score === 0);
  const completedSkills = skills.filter(s => s.status === 'assessed');

  const currentSkill = skills.find((s) => s.id === selectedSkillId);
  // For demo, pick random 3 questions or mix
  // In real app, this would come from Gemini based on skill name
  const [questions, setQuestions] = useState(mockAssessmentQuestions.slice(0, 3));

  useEffect(() => {
    if (location.state?.skillId) {
      startAssessment(location.state.skillId);
      // Clear state so back button doesn't restart
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const startAssessment = async (skillId: string) => {
    setSelectedSkillId(skillId);
    setState('generating');

    try {
      const skillName = skills.find(s => s.id === skillId)?.name || 'General Skill';
      // Call AI API
      const generatedQuestions = await generateQuizWithAI(skillName);

      // Map to AssessmentQuestion interface (add ids)
      const formattedQuestions = generatedQuestions.map((q: any, i: number) => ({
        id: `gen-${Date.now()}-${i}`,
        skillId,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer
      }));

      setQuestions(formattedQuestions);
      setCurrentQuestion(0);
      setAnswers([]);
      setResult(null);
      setState('in-progress');
    } catch (error) {
      toast({
        title: "Failed to generate quiz",
        description: error instanceof Error ? error.message : "Falling back to demo questions.",
        variant: "destructive"
      });
      // Fallback to mock data
      setQuestions(mockAssessmentQuestions.sort(() => 0.5 - Math.random()).slice(0, 3));
      setState('in-progress');
    }
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

      // New score is strictly based on the test
      const newScore = percentage;

      setResult({
        skillName: currentSkill?.name || '',
        correct,
        total: questions.length,
        newScore,
      });

      if (selectedSkillId) {
        updateSkillScore(selectedSkillId, newScore);
      }

      setTimeout(() => setState('completed'), 500);
    }
  };

  const resetAssessment = () => {
    setState('select');
    setSelectedSkillId(null);
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
          Verify your skills to boost your readiness score.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {state === 'select' && (
          <motion.div
            key="select"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {pendingSkills.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold mb-4">Pending Assessments</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {pendingSkills.map((skill) => (
                    <Card
                      key={skill.id}
                      className="hover:border-primary/30 transition-colors cursor-pointer border-l-4 border-l-primary"
                      onClick={() => startAssessment(skill.id)}
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                            <Target className="w-6 h-6 text-primary-foreground" />
                          </div>
                          <span className="text-sm text-muted-foreground">~5 min</span>
                        </div>
                        <CardTitle className="font-display text-xl mt-4">{skill.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <Button className="w-full gap-2">
                            Start Assessment <ArrowRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {completedSkills.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold mb-4">Completed</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {completedSkills.map((skill) => (
                    <Card key={skill.id} className="opacity-75 hover:opacity-100 transition-opacity">
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <h3 className="font-bold">{skill.name}</h3>
                          <span className="text-primary font-bold">{skill.score}%</span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Button variant="outline" size="sm" onClick={() => startAssessment(skill.id)}>
                          Retake
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {pendingSkills.length === 0 && completedSkills.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                No skills found. Upload your resume on the dashboard to get started.
              </div>
            )}
          </motion.div>
        )}

        {state === 'generating' && (
          <motion.div
            key="generating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center h-64 space-y-4"
          >
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <h2 className="text-xl font-semibold">Generating Adaptive Quiz...</h2>
            <p className="text-muted-foreground">Analyzing {currentSkill?.name} context and difficulty...</p>
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
                  <span className="text-sm font-medium text-primary">{currentSkill?.name} Assessment</span>
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
                            className={`w-full p-4 rounded-xl border text-left transition-all ${showResult
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
                  You scored {result.newScore}% on {result.skillName}.
                </p>

                <div className="bg-secondary/50 rounded-xl p-6 mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-muted-foreground">Verified Score</span>
                    <span className="font-semibold text-foreground">{result.skillName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Readiness Impact</span>
                    <span className="text-2xl font-display font-bold text-primary">
                      +{Math.round(result.newScore / (skills.length || 1))}%
                    </span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => navigate('/dashboard')} className="flex-1 gap-2">
                    Back to Dashboard
                  </Button>
                  <Button onClick={resetAssessment} className="flex-1">
                    Next Assessment
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
