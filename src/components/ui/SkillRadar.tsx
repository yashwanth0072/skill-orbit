import { motion } from 'framer-motion';
import { Skill } from '@/lib/mockData';

interface SkillRadarProps {
  skills: Skill[];
  size?: number;
}

export function SkillRadar({ skills, size = 280 }: SkillRadarProps) {
  const center = size / 2;
  const maxRadius = (size / 2) - 40;
  const levels = 4;

  // Take top 6 skills for the radar
  const displaySkills = skills.slice(0, 6);
  const angleStep = (2 * Math.PI) / displaySkills.length;

  const getPoint = (index: number, value: number) => {
    const angle = angleStep * index - Math.PI / 2;
    const radius = (value / 100) * maxRadius;
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle),
    };
  };

  const createPolygonPoints = (values: number[]) => {
    return values
      .map((value, index) => {
        const point = getPoint(index, value);
        return `${point.x},${point.y}`;
      })
      .join(' ');
  };

  const skillValues = displaySkills.map((s) => s.score);
  const targetValues = displaySkills.map((s) => s.targetScore);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="overflow-visible">
        {/* Background circles */}
        {Array.from({ length: levels }).map((_, i) => (
          <circle
            key={i}
            cx={center}
            cy={center}
            r={((i + 1) / levels) * maxRadius}
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
        ))}

        {/* Axis lines */}
        {displaySkills.map((_, index) => {
          const point = getPoint(index, 100);
          return (
            <line
              key={index}
              x1={center}
              y1={center}
              x2={point.x}
              y2={point.y}
              stroke="hsl(var(--border))"
              strokeWidth="1"
            />
          );
        })}

        {/* Target polygon */}
        <motion.polygon
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          points={createPolygonPoints(targetValues)}
          fill="hsl(var(--primary) / 0.1)"
          stroke="hsl(var(--primary) / 0.3)"
          strokeWidth="2"
          strokeDasharray="6 4"
        />

        {/* Current skill polygon */}
        <motion.polygon
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.6, type: 'spring' }}
          points={createPolygonPoints(skillValues)}
          fill="hsl(var(--primary) / 0.2)"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
          style={{ transformOrigin: 'center' }}
        />

        {/* Skill points */}
        {displaySkills.map((skill, index) => {
          const point = getPoint(index, skill.score);
          return (
            <motion.circle
              key={skill.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + index * 0.1, duration: 0.3 }}
              cx={point.x}
              cy={point.y}
              r="6"
              fill="hsl(var(--primary))"
              stroke="hsl(var(--background))"
              strokeWidth="2"
            />
          );
        })}

        {/* Skill labels */}
        {displaySkills.map((skill, index) => {
          const labelPoint = getPoint(index, 115);
          const angle = angleStep * index - Math.PI / 2;
          const isLeft = Math.cos(angle) < -0.1;
          const isRight = Math.cos(angle) > 0.1;

          return (
            <motion.text
              key={`label-${skill.id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              x={labelPoint.x}
              y={labelPoint.y}
              textAnchor={isLeft ? 'end' : isRight ? 'start' : 'middle'}
              dominantBaseline="middle"
              className="fill-foreground text-xs font-medium"
            >
              {skill.name}
            </motion.text>
          );
        })}
      </svg>

      {/* Center score */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.4, type: 'spring' }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="text-center">
          <div className="text-2xl font-bold font-display text-primary">
            {Math.round(skillValues.reduce((a, b) => a + b, 0) / skillValues.length)}%
          </div>
          <div className="text-xs text-muted-foreground">Avg Score</div>
        </div>
      </motion.div>
    </div>
  );
}
