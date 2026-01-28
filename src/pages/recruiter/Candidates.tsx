import { motion } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  MapPin,
  Mail,
  ChevronDown,
  ChevronUp,
  Star,
  TrendingUp,
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

export default function Candidates() {
  const { candidates } = useApp();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'match' | 'readiness'>('match');

  const sortedCandidates = [...candidates].sort((a, b) =>
    sortBy === 'match'
      ? b.matchPercentage - a.matchPercentage
      : b.readinessIndex - a.readinessIndex
  );

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
            Ranked list of candidates who accepted your opportunity.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={sortBy === 'match' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('match')}
            className="gap-2"
          >
            <Star className="w-4 h-4" /> By Match %
          </Button>
          <Button
            variant={sortBy === 'readiness' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('readiness')}
            className="gap-2"
          >
            <TrendingUp className="w-4 h-4" /> By Readiness
          </Button>
        </div>
      </motion.div>

      {/* Candidate List */}
      <motion.div variants={itemVariants} className="space-y-4">
        {sortedCandidates.map((candidate, index) => (
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
                <Button size="sm" className="gap-2">
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
    </motion.div>
  );
}
