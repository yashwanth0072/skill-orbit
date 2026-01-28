import { motion } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  MapPin,
  Mail,
  ChevronDown,
  ChevronUp,
  Star,
  TrendingUp,
  Briefcase
} from 'lucide-react';
import { useState } from 'react';
import { ContactCandidateModal } from '@/components/ContactCandidateModal';
import { Candidate } from '@/lib/mockData';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Candidates() {
  const { candidates, jobRoles, getAcceptedCandidatesForJob } = useApp();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [contactCandidate, setContactCandidate] = useState<Candidate | null>(null);

  // Group candidates by Job Role
  const rolesWithCandidates = jobRoles.map(role => ({
    role,
    candidates: getAcceptedCandidatesForJob(role.id)
  })).filter(item => item.candidates.length > 0);

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
          <h1 className="font-display text-3xl font-bold text-foreground">Candidates</h1>
          <p className="text-muted-foreground mt-1">
            Manage candidates grouped by your active job roles.
          </p>
        </div>
      </motion.div>

      {rolesWithCandidates.length > 0 ? (
        <div className="space-y-8">
          {rolesWithCandidates.map(({ role, candidates: roleCandidates }) => (
            <motion.div key={role.id} variants={itemVariants} className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Briefcase className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-display font-semibold text-foreground">{role.title}</h2>
                <Badge variant="secondary" className="ml-2">{roleCandidates.length} Candidates</Badge>
              </div>

              {roleCandidates.map((candidate, index) => (
                <Card
                  key={candidate.id}
                  className="overflow-hidden hover:border-primary/20 transition-colors"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground font-display font-bold text-lg">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-display text-xl font-semibold text-foreground">
                            {candidate.name}
                          </h3>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                              <Mail className="w-4 h-4" />
                              {candidate.email}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <MapPin className="w-4 h-4" />
                              {candidate.location}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <div className="text-2xl font-display font-bold text-primary">
                            {candidate.matchPercentage}%
                          </div>
                          <div className="text-xs text-muted-foreground">Match</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-display font-bold text-success">
                            {candidate.readinessIndex}%
                          </div>
                          <div className="text-xs text-muted-foreground">Readiness</div>
                        </div>
                      </div>
                    </div>

                    {/* Expand/Collapse Skills */}
                    <button
                      onClick={() => setExpandedId(expandedId === candidate.id ? null : candidate.id)}
                      className="flex items-center gap-2 mt-4 text-sm text-primary hover:text-primary/80 transition-colors"
                    >
                      View Skills
                      {expandedId === candidate.id ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>

                    {expandedId === candidate.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-4 p-4 bg-secondary/50 rounded-xl"
                      >
                        <h4 className="text-sm font-medium text-foreground mb-3">Skill Scores</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {candidate.skills.map((skill) => (
                            <div
                              key={skill.id}
                              className="flex items-center justify-between p-3 bg-background rounded-lg border border-border"
                            >
                              <span className="text-sm text-foreground">{skill.name}</span>
                              <Badge
                                variant={skill.score >= skill.targetScore ? 'default' : 'secondary'}
                                className={
                                  skill.score >= skill.targetScore
                                    ? 'bg-success text-success-foreground'
                                    : ''
                                }
                              >
                                {skill.score}%
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 mt-4 pt-4 border-t border-border">
                      <Button
                        size="sm"
                        className="gap-2"
                        onClick={() => setContactCandidate(candidate)}
                      >
                        <Mail className="w-4 h-4" /> Contact
                      </Button>
                      <Button variant="outline" size="sm">
                        View Full Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
          <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mb-4">
            <Briefcase className="w-8 h-8 text-muted-foreground/50" />
          </div>
          <h3 className="text-lg font-medium text-foreground">No Candidates Yet</h3>
          <p className="max-w-sm mt-2">
            Once candidates accept your job opportunities, they will be listed here grouped by role.
          </p>
        </div>
      )}

      {/* Modal */}
      <ContactCandidateModal
        isOpen={!!contactCandidate}
        candidate={contactCandidate}
        onClose={() => setContactCandidate(null)}
      />
    </motion.div>
  );
}
