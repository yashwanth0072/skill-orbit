import { motion } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockJobRoles } from '@/lib/mockData';
import { Users, Briefcase, TrendingUp, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function RecruiterDashboard() {
  const { candidates } = useApp();
  const acceptedCandidates = candidates.filter((c) => c.acceptedAt);
  const jobRole = mockJobRoles[0];

  const avgMatchPercentage = acceptedCandidates.length > 0 
    ? Math.round(
        acceptedCandidates.reduce((sum, c) => sum + c.matchPercentage, 0) / acceptedCandidates.length
      )
    : 0;

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
          <h1 className="font-display text-3xl font-bold text-foreground">Recruiter Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            View candidates who've accepted opportunities.
          </p>
        </div>
        <Link to="/recruiter/candidates">
          <Button className="gap-2">
            <Users className="w-4 h-4" /> View Candidates
          </Button>
        </Link>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="gradient-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Roles</p>
                <p className="text-3xl font-display font-bold text-foreground mt-1">
                  {mockJobRoles.length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Eligible Candidates</p>
                <p className="text-3xl font-display font-bold text-foreground mt-1">
                  {acceptedCandidates.length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Match %</p>
                <p className="text-3xl font-display font-bold text-foreground mt-1">
                  {avgMatchPercentage}%
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-info" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Skills Tracked</p>
                <p className="text-3xl font-display font-bold text-foreground mt-1">
                  {jobRole.requiredSkills.length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <Target className="w-6 h-6 text-accent-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Active Job Role */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="font-display">Active Job Role</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-display text-xl font-semibold text-foreground">
                  {jobRole.title}
                </h3>
                <p className="text-muted-foreground mt-1">{jobRole.description}</p>
                <div className="flex gap-4 mt-4 text-sm text-muted-foreground">
                  <span>{jobRole.location}</span>
                  <span>{jobRole.salaryRange}</span>
                  <span>Posted {jobRole.postedAt}</span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-medium text-foreground mb-3">Required Skills</h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {jobRole.requiredSkills.map((skill) => (
                  <div
                    key={skill.skillId}
                    className="p-3 rounded-xl bg-secondary/50 border border-border"
                  >
                    <div className="text-sm font-medium text-foreground">{skill.name}</div>
                    <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
                      <span>{skill.weight}% weight</span>
                      <span>Min: {skill.minScore}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Top Candidates Preview */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-display">Top Candidates</CardTitle>
            <Link to="/recruiter/candidates">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {acceptedCandidates.slice(0, 3).map((candidate, index) => (
                <div
                  key={candidate.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 border border-border"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">{candidate.name}</h4>
                      <p className="text-sm text-muted-foreground">{candidate.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-display font-bold text-primary">
                      {candidate.matchPercentage}%
                    </div>
                    <div className="text-xs text-muted-foreground">match</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
