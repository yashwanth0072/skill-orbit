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
  const { opportunities, updateOpportunityStatus } = useApp();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'declined'>('all');

  const filteredOpportunities = opportunities.filter((opp) =>
    filter === 'all' ? true : opp.status === filter
  );

  const pendingCount = opportunities.filter((o) => o.status === 'pending').length;
  const acceptedCount = opportunities.filter((o) => o.status === 'accepted').length;

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
          Review and respond to job matches based on your skill profile.
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4">
        <Card className="gradient-card">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Matches</p>
            <p className="text-3xl font-display font-bold text-foreground mt-1">
              {opportunities.length}
            </p>
          </CardContent>
        </Card>
        <Card className="gradient-card">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Pending Review</p>
            <p className="text-3xl font-display font-bold text-warning mt-1">{pendingCount}</p>
          </CardContent>
        </Card>
        <Card className="gradient-card">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Accepted</p>
            <p className="text-3xl font-display font-bold text-success mt-1">{acceptedCount}</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants} className="flex gap-2">
        {(['all', 'pending', 'accepted', 'declined'] as const).map((f) => (
          <Button
            key={f}
            variant={filter === f ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(f)}
            className="capitalize"
          >
            {f}
          </Button>
        ))}
      </motion.div>

      {/* Opportunity List */}
      <motion.div variants={itemVariants} className="space-y-4">
        {filteredOpportunities.map((opportunity) => (
          <Card
            key={opportunity.id}
            className="overflow-hidden hover:border-primary/20 transition-colors"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-display text-xl font-semibold text-foreground">
                      {opportunity.title}
                    </h3>
                    <StatusBadge status={opportunity.status} />
                  </div>
                  <p className="text-lg text-muted-foreground mb-4">{opportunity.company}</p>

                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      {opportunity.location}
                    </span>
                    {opportunity.salaryRange && (
                      <span className="flex items-center gap-1.5">
                        <DollarSign className="w-4 h-4" />
                        {opportunity.salaryRange}
                      </span>
                    )}
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      Posted {opportunity.postedAt}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-3xl font-display font-bold text-primary">
                    {opportunity.matchPercentage}%
                  </div>
                  <div className="text-sm text-muted-foreground">Match</div>
                </div>
              </div>

              {/* Skill Match Details */}
              <button
                onClick={() => setExpandedId(expandedId === opportunity.id ? null : opportunity.id)}
                className="flex items-center gap-2 mt-4 text-sm text-primary hover:text-primary/80 transition-colors"
              >
                <Info className="w-4 h-4" />
                Why this match?
                {expandedId === opportunity.id ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>

              {expandedId === opportunity.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-4 p-4 bg-secondary/50 rounded-xl"
                >
                  <h4 className="text-sm font-medium text-foreground mb-3">Skill Breakdown</h4>
                  <div className="space-y-2">
                    {opportunity.skills.map((skill) => (
                      <div key={skill.name} className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{skill.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            {skill.weight}% weight
                          </span>
                          {skill.matched ? (
                            <Check className="w-4 h-4 text-success" />
                          ) : (
                            <X className="w-4 h-4 text-destructive" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Actions */}
              {opportunity.status === 'pending' && (
                <div className="flex gap-3 mt-6">
                  <Button
                    onClick={() => updateOpportunityStatus(opportunity.id, 'accepted')}
                    className="gap-2"
                  >
                    <Check className="w-4 h-4" /> Accept & Share Profile
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => updateOpportunityStatus(opportunity.id, 'declined')}
                    className="gap-2"
                  >
                    <X className="w-4 h-4" /> Decline
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {filteredOpportunities.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No opportunities found.</p>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </motion.div>
  );
}
