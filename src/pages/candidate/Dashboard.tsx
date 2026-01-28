import { motion } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { SkillRadar } from '@/components/ui/SkillRadar';
import { SkillBar } from '@/components/ui/SkillBar';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ResumeUpload } from '@/components/ResumeUpload';
import { calculateReadinessIndex, mockSkillGaps, Skill } from '@/lib/mockData';
import { ResumeData } from '@/lib/resumeTypes';
import { Link } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import {
  Target,
  TrendingUp,
  Bell,
  ArrowRight,
  Briefcase,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
} from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function CandidateDashboard() {
  const { skills, opportunities, events, settings, setSkills } = useApp();
  const readinessIndex = calculateReadinessIndex(skills);
  const pendingOpportunities = opportunities.filter((o) => o.status === 'pending');
  const topGaps = mockSkillGaps.slice(0, 3);
  const upcomingEvents = events.filter((e) => !e.completed).slice(0, 2);

  const handleResumeProcessed = (resumeData: ResumeData) => {
    if (resumeData.extractedSkills && resumeData.extractedSkills.length > 0) {
      const newSkills: Skill[] = resumeData.extractedSkills.map((extracted, index) => ({
        id: `resume-${index + 1}`,
        name: extracted.name,
        category: extracted.category,
        score: Math.min(100, 50 + (extracted.yearsOfExperience || 1) * 10),
        maxScore: 100,
        targetScore: 80,
        assessedAt: new Date().toISOString().split('T')[0],
      }));

      // Merge with existing skills, preferring resume data for duplicates
      const existingSkillNames = new Set(skills.map((s) => s.name.toLowerCase()));
      const uniqueNewSkills = newSkills.filter(
        (s) => !existingSkillNames.has(s.name.toLowerCase())
      );
      const updatedSkills = [...skills, ...uniqueNewSkills];

      setSkills(updatedSkills);
      toast({
        title: 'Skills updated!',
        description: `Added ${uniqueNewSkills.length} new skills from your resume.`,
      });
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Welcome Back!</h1>
          <p className="text-muted-foreground mt-1">
            Here's your skill overview and latest opportunities.
          </p>
        </div>
        <Link to="/assessments">
          <Button className="gap-2">
            <Target className="w-4 h-4" /> Take Assessment
          </Button>
        </Link>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="gradient-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Readiness Index</p>
                <p className="text-3xl font-display font-bold text-foreground mt-1">
                  {readinessIndex}%
                </p>
              </div>
              <ProgressRing value={readinessIndex} size={60} strokeWidth={6} showPercentage={false} />
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Skills Assessed</p>
                <p className="text-3xl font-display font-bold text-foreground mt-1">
                  {skills.length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Matches</p>
                <p className="text-3xl font-display font-bold text-foreground mt-1">
                  {pendingOpportunities.length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                <Bell className="w-6 h-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Reverse Hiring</p>
                <p className="text-lg font-semibold text-foreground mt-1">
                  {settings.reverseHiringEnabled ? 'Enabled' : 'Disabled'}
                </p>
              </div>
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  settings.reverseHiringEnabled ? 'bg-success/10' : 'bg-muted'
                }`}
              >
                {settings.reverseHiringEnabled ? (
                  <CheckCircle className="w-6 h-6 text-success" />
                ) : (
                  <Clock className="w-6 h-6 text-muted-foreground" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Resume Upload Section */}
      <motion.div variants={itemVariants}>
        <ResumeUpload onResumeProcessed={handleResumeProcessed} />
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Skill Radar */}
        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="font-display text-lg">Skill Overview</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <SkillRadar skills={skills} />
            </CardContent>
          </Card>
        </motion.div>

        {/* Skill Gaps */}
        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-display text-lg">Priority Skill Gaps</CardTitle>
              <AlertTriangle className="w-5 h-5 text-warning" />
            </CardHeader>
            <CardContent className="space-y-6">
              {topGaps.map((gap, index) => (
                <div key={gap.skillId} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{gap.skillName}</span>
                    <StatusBadge status={gap.priority === 'high' ? 'pending' : 'unmatched'} />
                  </div>
                  <SkillBar
                    name=""
                    score={gap.currentScore}
                    targetScore={gap.requiredScore}
                    showTarget
                    delay={index * 0.1}
                  />
                </div>
              ))}
              <Link to="/events" className="block">
                <Button variant="outline" className="w-full gap-2">
                  Find Learning Events <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Opportunities */}
        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-display text-lg">Recent Opportunities</CardTitle>
              <Briefcase className="w-5 h-5 text-primary" />
            </CardHeader>
            <CardContent className="space-y-4">
              {opportunities.slice(0, 3).map((opp) => (
                <div
                  key={opp.id}
                  className="p-4 rounded-xl bg-secondary/50 border border-border hover:border-primary/20 transition-colors"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground truncate">{opp.title}</h4>
                      <p className="text-sm text-muted-foreground">{opp.company}</p>
                    </div>
                    <StatusBadge status={opp.status} className="flex-shrink-0" />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground truncate">{opp.location}</span>
                    <span className="font-semibold text-primary flex-shrink-0 ml-2">
                      {opp.matchPercentage}% match
                    </span>
                  </div>
                </div>
              ))}
              <Link to="/opportunities" className="block">
                <Button variant="ghost" className="w-full gap-2">
                  View All <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Upcoming Events */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-display text-lg">Recommended Events</CardTitle>
            <Calendar className="w-5 h-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-4 rounded-xl bg-secondary/50 border border-border hover:border-primary/20 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            event.type === 'workshop'
                              ? 'bg-info/10 text-info'
                              : event.type === 'bootcamp'
                              ? 'bg-success/10 text-success'
                              : 'bg-accent/10 text-accent-foreground'
                          }`}
                        >
                          {event.type}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {event.skillGapMatch}% skill gap match
                        </span>
                      </div>
                      <h4 className="font-medium text-foreground">{event.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-muted-foreground">
                      {event.date} • {event.location}
                    </span>
                    <Button size="sm" variant="outline">
                      Learn More
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Link to="/events">
                <Button variant="ghost" className="w-full gap-2">
                  Explore All Events <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
