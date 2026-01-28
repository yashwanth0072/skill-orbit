import { motion } from 'framer-motion';

interface SkillBarProps {
  name: string;
  score: number;
  maxScore?: number;
  targetScore?: number;
  showTarget?: boolean;
  delay?: number;
}

export function SkillBar({
  name,
  score,
  maxScore = 100,
  targetScore,
  showTarget = false,
  delay = 0,
}: SkillBarProps) {
  const percentage = (score / maxScore) * 100;
  const targetPercentage = targetScore ? (targetScore / maxScore) * 100 : 0;
  const isAboveTarget = targetScore ? score >= targetScore : true;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">{name}</span>
        <span className="text-sm font-semibold text-primary">{score}%</span>
      </div>
      <div className="relative h-2 bg-secondary rounded-full overflow-hidden">
        {/* Target indicator */}
        {showTarget && targetScore && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.3, duration: 0.3 }}
            className="absolute top-0 bottom-0 w-0.5 bg-muted-foreground/50 z-10"
            style={{ left: `${targetPercentage}%` }}
          />
        )}
        {/* Progress bar */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ delay, duration: 0.8, ease: 'easeOut' }}
          className={`h-full rounded-full ${
            isAboveTarget ? 'bg-primary' : 'bg-warning'
          }`}
        />
      </div>
      {showTarget && targetScore && !isAboveTarget && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.5 }}
          className="text-xs text-muted-foreground"
        >
          {targetScore - score} points to reach target
        </motion.p>
      )}
    </div>
  );
}
