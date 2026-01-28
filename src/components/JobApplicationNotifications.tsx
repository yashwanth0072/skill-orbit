import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  CheckCircle, 
  XCircle,
  Bell,
} from 'lucide-react';

export function JobApplicationNotifications() {
  const { 
    jobApplications, 
    respondToJobApplication, 
    userRole 
  } = useApp();

  // Only show for candidates
  if (userRole !== 'candidate') return null;

  const pendingApplications = jobApplications.filter(
    (app) => app.status === 'pending'
  );

  if (pendingApplications.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="flex items-center gap-2 mb-4">
        <Bell className="w-5 h-5 text-primary" />
        <h2 className="font-display text-lg font-semibold text-foreground">
          New Job Opportunities
        </h2>
        <Badge variant="secondary">{pendingApplications.length}</Badge>
      </div>
      
      <div className="space-y-4">
        <AnimatePresence>
          {pendingApplications.map((application) => (
            <motion.div
              key={application.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, height: 0 }}
              layout
            >
              <Card className="border-primary/30 bg-primary/5">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Briefcase className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-display text-lg font-semibold text-foreground">
                            {application.jobRole.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {application.jobRole.company}
                          </p>
                        </div>
                      </div>

                      <p className="text-muted-foreground text-sm mb-4">
                        {application.jobRole.description}
                      </p>

                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4" />
                          {application.jobRole.location}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <DollarSign className="w-4 h-4" />
                          {application.jobRole.salaryRange}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Match Score:</span>
                        <Badge 
                          variant="default" 
                          className="bg-success text-success-foreground"
                        >
                          {application.matchPercentage}%
                        </Badge>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button
                        size="sm"
                        className="gap-2"
                        onClick={() => respondToJobApplication(application.id, 'accepted')}
                      >
                        <CheckCircle className="w-4 h-4" />
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-2"
                        onClick={() => respondToJobApplication(application.id, 'declined')}
                      >
                        <XCircle className="w-4 h-4" />
                        Decline
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
