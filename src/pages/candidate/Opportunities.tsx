import { motion } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import {
  MapPin,
  DollarSign,
  Calendar,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  Info,
} from 'lucide-react';
import { useState } from 'react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Opportunities() {
  const { jobRoles, applyToJob, jobApplications, skills } = useApp();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Filter jobs that the user hasn't applied to yet? Or show status?
  // User wants "Present Jobs listing".
  // Let's show all Job Roles as "Opportunities".
  // We need to calculate match percentage for visual.

  const opportunitiesWithMeta = jobRoles.map(role => {
    // Check if applied
    const application = jobApplications.find(app => app.jobRoleId === role.id);
    const hasApplied = application?.status === 'applied' || application?.status === 'accepted';

    // Simulating match percentage calculation
    // In real app, we compare role.requiredSkills with user skills
    const match = 85; // Placeholder or calculate

    return {
      ...role,
      matchPercentage: match,
      hasApplied,
      status: application?.status || 'open'
    };
  });

  const handleApply = (id: string) => {
    applyToJob(id);
    // Optimistic UI update handled by re-render from context change
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="font-display text-3xl font-bold text-foreground">Opportunities</h1>
        <p className="text-muted-foreground mt-1">
          Browse open roles and apply with your verified skill profile.
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4">
        <Card className="gradient-card">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Available Roles</p>
            <p className="text-3xl font-display font-bold text-foreground mt-1">
              {jobRoles.length}
            </p>
          </CardContent>
        </Card>
        <Card className="gradient-card">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Applied</p>
            <p className="text-3xl font-display font-bold text-primary mt-1">
              {opportunitiesWithMeta.filter(o => o.hasApplied).length}
            </p>
          </CardContent>
        </Card>
        <Card className="gradient-card">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Matches</p>
            <p className="text-3xl font-display font-bold text-success mt-1">
              {opportunitiesWithMeta.filter(o => o.matchPercentage > 80).length}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Opportunity List */}
      <motion.div variants={itemVariants} className="space-y-4">
        {opportunitiesWithMeta.map((role) => (
          <Card
            key={role.id}
            className="overflow-hidden hover:border-primary/20 transition-colors"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-display text-xl font-semibold text-foreground">
                      {role.title}
                    </h3>
                    {role.hasApplied && <StatusBadge status={role.status === 'accepted' ? 'accepted' : 'pending'} />}
                  </div>
                  <p className="text-lg text-muted-foreground mb-4">{role.company}</p>

                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      {role.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4" />
                      {role.salaryRange}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      {role.postedAt}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-3xl font-display font-bold text-primary">
                    {role.matchPercentage}%
                  </div>
                  <div className="text-sm text-muted-foreground">Match</div>
                </div>
              </div>

              {/* Skill Match Details */}
              <button
                onClick={() => setExpandedId(expandedId === role.id ? null : role.id)}
                className="flex items-center gap-2 mt-4 text-sm text-primary hover:text-primary/80 transition-colors"
              >
                <Info className="w-4 h-4" />
                View Requirements
                {expandedId === role.id ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>

              {expandedId === role.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-4 p-4 bg-secondary/50 rounded-xl"
                >
                  <h4 className="text-sm font-medium text-foreground mb-3">Required Skills</h4>
                  <div className="space-y-2">
                    {role.requiredSkills.map((skill) => (
                      <div key={skill.name} className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{skill.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">Target: {skill.minScore}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">{role.description}</p>
                </motion.div>
              )}

              {/* Actions */}
              <div className="flex gap-3 mt-6">
                {!role.hasApplied ? (
                  <Button
                    onClick={() => handleApply(role.id)}
                    className="gap-2"
                  >
                    <Check className="w-4 h-4" /> Apply Now
                  </Button>
                ) : (
                  <Button variant="outline" disabled className="gap-2">
                    <Check className="w-4 h-4" /> Applied
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {opportunitiesWithMeta.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No open roles found.</p>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </motion.div>
  );
}
