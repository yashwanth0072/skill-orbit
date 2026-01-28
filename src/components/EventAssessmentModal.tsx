import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Brain, Target, Award, TrendingUp } from 'lucide-react';
import { Event, Skill, calculateReadinessIndex } from '@/lib/mockData';

interface EventAssessmentModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (eventId: string, scoreGain: number) => void;
  skills: Skill[];
}

interface Question {
  id: string;
  question: string;
  options: { value: string; label: string; points: number }[];
}

const getQuestionsForEvent = (event: Event): Question[] => {
  const baseQuestions: Question[] = [
    {
      id: 'engagement',
      question: `How actively did you participate in the ${event.type}?`,
      options: [
        { value: 'passive', label: 'Mostly observed', points: 1 },
        { value: 'moderate', label: 'Participated in discussions', points: 2 },
        { value: 'active', label: 'Actively contributed and practiced', points: 3 },
      ],
    },
    {
      id: 'understanding',
      question: `How well do you understand the concepts covered in "${event.title}"?`,
      options: [
        { value: 'basic', label: 'Basic understanding', points: 1 },
        { value: 'good', label: 'Good understanding, need more practice', points: 2 },
        { value: 'excellent', label: 'Excellent understanding, can apply immediately', points: 3 },
      ],
    },
    {
      id: 'application',
      question: 'Can you apply what you learned to real projects?',
      options: [
        { value: 'not_yet', label: 'Need more learning first', points: 1 },
        { value: 'with_help', label: 'Yes, with some guidance', points: 2 },
        { value: 'independently', label: 'Yes, independently', points: 3 },
      ],
    },
  ];

  if (event.type === 'hackathon') {
    baseQuestions.push({
      id: 'project',
      question: 'Did you complete a project during the hackathon?',
      options: [
        { value: 'no', label: 'Started but did not finish', points: 1 },
        { value: 'partial', label: 'Completed a basic version', points: 2 },
        { value: 'full', label: 'Completed with extra features', points: 3 },
      ],
    });
  } else if (event.type === 'bootcamp') {
    baseQuestions.push({
      id: 'exercises',
      question: 'How many exercises/assignments did you complete?',
      options: [
        { value: 'some', label: 'Less than half', points: 1 },
        { value: 'most', label: 'More than half', points: 2 },
        { value: 'all', label: 'All of them', points: 3 },
      ],
    });
  } else if (event.type === 'workshop') {
    baseQuestions.push({
      id: 'hands_on',
      question: 'Did you complete the hands-on exercises?',
      options: [
        { value: 'watched', label: 'Only watched the demo', points: 1 },
        { value: 'tried', label: 'Tried some exercises', points: 2 },
        { value: 'completed', label: 'Completed all exercises', points: 3 },
      ],
    });
  }

  return baseQuestions;
};

export function EventAssessmentModal({
  event,
  isOpen,
  onClose,
  onComplete,
  skills,
}: EventAssessmentModalProps) {
  const [step, setStep] = useState<'questions' | 'reflection' | 'results'>('questions');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [reflection, setReflection] = useState('');
  const [resultData, setResultData] = useState<{
    skillBoost: number;
    oldReadiness: number;
    newReadiness: number;
    affectedSkills: string[];
  } | null>(null);

  if (!event) return null;

  const questions = getQuestionsForEvent(event);
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleAnswer = (value: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setStep('reflection');
    }
  };

  const handleSubmitReflection = () => {
    // Calculate score based on answers
    let score = 0;
    questions.forEach((q) => {
      const answer = answers[q.id];
      const option = q.options.find((o) => o.value === answer);
      if (option) {
        score += option.points;
      }
    });

    // Add bonus for reflection (if substantial)
    if (reflection.length > 50) {
      score += 2;
    } else if (reflection.length > 20) {
      score += 1;
    }

    // Calculate percentage gain per skill (max 15% per event)
    const maxPoints = questions.length * 3 + 2;
    const skillBoost = Math.round((score / maxPoints) * 15);

    // Calculate actual readiness change
    const oldReadiness = calculateReadinessIndex(skills);

    // Simulate the skill updates to calculate new readiness
    const affectedSkillNames: string[] = [];
    const updatedSkills = skills.map((skill) => {
      const isRelevant = event.relevantSkills.some(
        (rs) => rs.toLowerCase() === skill.name.toLowerCase()
      );
      if (isRelevant) {
        affectedSkillNames.push(skill.name);
        return { ...skill, score: Math.min(100, skill.score + skillBoost) };
      }
      return skill;
    });

    const newReadiness = calculateReadinessIndex(updatedSkills);

    setResultData({
      skillBoost,
      oldReadiness,
      newReadiness,
      affectedSkills: affectedSkillNames,
    });
    setStep('results');
  };

  const handleComplete = () => {
    if (resultData) {
      onComplete(event.id, resultData.skillBoost);
    }
    // Reset state
    setStep('questions');
    setCurrentQuestionIndex(0);
    setAnswers({});
    setReflection('');
    setResultData(null);
    onClose();
  };

  const handleClose = () => {
    // Reset state on close
    setStep('questions');
    setCurrentQuestionIndex(0);
    setAnswers({});
    setReflection('');
    setResultData(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="font-display flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            Event Completion Assessment
          </DialogTitle>
          <DialogDescription>
            Complete this assessment to update your skill profile based on "{event.title}"
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {step === 'questions' && (
            <motion.div
              key="questions"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-foreground">{currentQuestion.question}</h3>

                <RadioGroup
                  value={answers[currentQuestion.id] || ''}
                  onValueChange={handleAnswer}
                  className="space-y-3"
                >
                  {currentQuestion.options.map((option) => (
                    <div
                      key={option.value}
                      className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:border-primary/20 transition-colors"
                    >
                      <RadioGroupItem value={option.value} id={option.value} />
                      <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <Button
                onClick={handleNext}
                disabled={!answers[currentQuestion.id]}
                className="w-full"
              >
                {currentQuestionIndex < questions.length - 1 ? 'Next' : 'Continue to Reflection'}
              </Button>
            </motion.div>
          )}

          {step === 'reflection' && (
            <motion.div
              key="reflection"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <h3 className="font-medium text-foreground flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  What did you learn?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Briefly describe the key takeaways from this {event.type}. This helps us better
                  understand your learning progress.
                </p>
              </div>

              <Textarea
                placeholder={`Share what you learned from "${event.title}"...`}
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                className="min-h-[120px]"
              />

              <p className="text-xs text-muted-foreground">
                Tip: A detailed reflection (50+ characters) earns bonus points!
              </p>

              <Button onClick={handleSubmitReflection} className="w-full">
                Submit Assessment
              </Button>
            </motion.div>
          )}

          {step === 'results' && resultData && (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6 text-center"
            >
              <div className="w-20 h-20 mx-auto rounded-full bg-success/10 flex items-center justify-center">
                <Award className="w-10 h-10 text-success" />
              </div>

              <div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  Assessment Complete!
                </h3>
                <p className="text-muted-foreground">
                  Based on your participation and learning outcomes:
                </p>
              </div>

              {/* Skills Boost */}
              <div className="p-4 rounded-xl bg-secondary/50 border border-border">
                <p className="text-sm text-muted-foreground mb-1">Skill Boost per Skill</p>
                <p className="text-2xl font-display font-bold text-primary">
                  +{resultData.skillBoost}%
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Applied to: {resultData.affectedSkills.length > 0 ? resultData.affectedSkills.join(', ') : 'No matching skills found'}
                </p>
              </div>

              {/* Readiness Index Change */}
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <p className="text-sm font-medium text-foreground">Readiness Index Update</p>
                </div>
                <div className="flex items-center justify-center gap-4">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Before</p>
                    <p className="text-xl font-semibold text-muted-foreground">{resultData.oldReadiness}%</p>
                  </div>
                  <div className="text-2xl text-primary">→</div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">After</p>
                    <p className="text-xl font-semibold text-primary">{resultData.newReadiness}%</p>
                  </div>
                </div>
                <p className="text-lg font-display font-bold text-success mt-2">
                  +{resultData.newReadiness - resultData.oldReadiness}% Overall
                </p>
              </div>

              <div className="flex items-center gap-2 justify-center text-sm text-success">
                <CheckCircle className="w-4 h-4" />
                <span>Your profile has been updated</span>
              </div>

              <Button onClick={handleComplete} className="w-full">
                Done
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
