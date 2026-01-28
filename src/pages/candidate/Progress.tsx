import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import { SkillProgressTimeline, generateMockHistory, SkillHistoryEntry } from '@/components/SkillProgressTimeline';
import { Card, CardContent } from '@/components/ui/card';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { calculateReadinessIndex } from '@/lib/mockData';
import { TrendingUp, Target, Zap, Award } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Progress() {
  const { skills, events } = useApp();
  const readinessIndex = calculateReadinessIndex(skills);
  
  // Generate mock history data (in a real app, this would come from a database)
  const skillHistory = useMemo(() => {
    const baseHistory = generateMockHistory(skills);
    
    // Add entries for completed events
    const completedEvents = events.filter((e) => e.completed);
    completedEvents.forEach((event) => {
      event.relevantSkills.forEach((skillName) => {
        const skill = skills.find((s) => s.name.toLowerCase() === skillName.toLowerCase());
        if (skill) {
          baseHistory.push({
            date: new Date().toISOString().split('T')[0],
            skillId: skill.id,
            skillName: skill.name,
            oldScore: Math.max(0, skill.score - 5),
            newScore: skill.score,
            source: 'event',
            eventName: event.title,
          });
        }
      });
    });
    
    return baseHistory.sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [skills, events]);

  // Calculate stats
  const completedEvents = events.filter((e) => e.completed).length;
  const assessedSkills = skills.length;
  const averageScore = Math.round(skills.reduce((acc, s) => acc + s.score, 0) / skills.length);
  
  // Skills above target
  const skillsAboveTarget = skills.filter((s) => s.score >= s.targetScore).length;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="font-display text-3xl font-bold text-foreground">Your Progress</h1>
        <p className="text-muted-foreground mt-1">
          Track your skill improvement journey over time.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="gradient-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Readiness</p>
                <p className="text-2xl font-display font-bold text-foreground mt-1">
                  {readinessIndex}%
                </p>
              </div>
              <ProgressRing value={readinessIndex} size={48} strokeWidth={5} showPercentage={false} />
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Score</p>
                <p className="text-2xl font-display font-bold text-foreground mt-1">
                  {averageScore}%
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Events Done</p>
                <p className="text-2xl font-display font-bold text-foreground mt-1">
                  {completedEvents}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <Zap className="w-6 h-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Goals Met</p>
                <p className="text-2xl font-display font-bold text-foreground mt-1">
                  {skillsAboveTarget}/{assessedSkills}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                <Target className="w-6 h-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Timeline Chart */}
      <motion.div variants={itemVariants}>
        <SkillProgressTimeline skills={skills} skillHistory={skillHistory} />
      </motion.div>
    </motion.div>
  );
}
