import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockJobRoles } from '@/lib/mockData';
import {
  Briefcase,
  MapPin,
  DollarSign,
  Users,
  TrendingUp,
  Plus,
} from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function JobRoles() {
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
          <h1 className="font-display text-3xl font-bold text-foreground">Job Roles</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track open positions.
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" /> Post New Role
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                <p className="text-sm text-muted-foreground">Total Applicants</p>
                <p className="text-3xl font-display font-bold text-foreground mt-1">
                  {mockJobRoles.length * 3}
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
                <p className="text-sm text-muted-foreground">Avg Match Rate</p>
                <p className="text-3xl font-display font-bold text-foreground mt-1">
                  87%
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-info" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Job Roles List */}
      <motion.div variants={itemVariants} className="space-y-4">
        {mockJobRoles.map((role) => (
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
                    <Badge variant="secondary">{role.company}</Badge>
                  </div>
                  <p className="text-muted-foreground mb-4">{role.description}</p>

                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      {role.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4" />
                      {role.salaryRange}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {role.requiredSkills.map((skill) => (
                      <Badge key={skill.skillId} variant="outline" className="text-xs">
                        {skill.name} (min: {skill.minScore}%)
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="text-right ml-4">
                  <p className="text-sm text-muted-foreground">Posted</p>
                  <p className="text-lg font-semibold text-foreground">{role.postedAt}</p>
                </div>
              </div>

              <div className="flex gap-3 mt-4 pt-4 border-t border-border">
                <Button variant="outline" size="sm" className="flex-1">
                  View Applicants
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Edit Role
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Close Role
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>
    </motion.div>
  );
}
