import { motion } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Briefcase, TrendingUp, Target, Calendar, Send } from 'lucide-react';
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
  const { candidates, jobRoles, jobApplications, events } = useApp();

  // Dynamic Data Calculations
  const latestJobRole = jobRoles.length > 0 ? jobRoles[jobRoles.length - 1] : null;
  const upcomingEvents = events.filter((e) => !e.completed);
  const pendingApplications = jobApplications.filter((a) => a.status === 'pending');
  // In this mock context, 'candidates' array represents the roster of accepted/hired candidates
  const acceptedCandidates = candidates;

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
            Overview of your hiring pipeline and talent pool.
          </p>
        </div>
        <div className="flex gap-3">
          <Link to="/recruiter/jobs">
            <Button variant="outline" className="gap-2">
              <Briefcase className="w-4 h-4" /> Post Job
            </Button>
          </Link>
          <Link to="/recruiter/candidates">
            <Button className="gap-2">
              <Users className="w-4 h-4" /> View Candidates
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card className="gradient-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Roles</p>
                <p className="text-3xl font-display font-bold text-foreground mt-1">
                  {jobRoles.length}
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
                <p className="text-sm text-muted-foreground">Active Events</p>
                <p className="text-3xl font-display font-bold text-foreground mt-1">
                  {upcomingEvents.length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-info" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Responses</p>
                <p className="text-3xl font-display font-bold text-foreground mt-1">
                  {pendingApplications.length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                <Send className="w-6 h-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Hired Candidates</p>
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
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-accent-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Latest Job Role */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="font-display">Latest Job Role</CardTitle>
          </CardHeader>
          <CardContent>
            {latestJobRole ? (
              <>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-display text-xl font-semibold text-foreground">
                      {latestJobRole.title}
                    </h3>
                    <p className="text-muted-foreground mt-1">{latestJobRole.description}</p>
                    <div className="flex gap-4 mt-4 text-sm text-muted-foreground">
                      <span>{latestJobRole.location}</span>
                      <span>{latestJobRole.salaryRange}</span>
                      <span>Posted {latestJobRole.postedAt}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-sm font-medium text-foreground mb-3">Required Skills</h4>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {latestJobRole.requiredSkills.map((skill) => (
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
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No active job roles yet.</p>
                <Link to="/recruiter/jobs">
                  <Button variant="outline">Create your first Job Role</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Top Candidates Preview */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-display">Recent Candidates</CardTitle>
            <Link to="/recruiter/candidates">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {acceptedCandidates.length > 0 ? (
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
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                No candidates found yet.
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
