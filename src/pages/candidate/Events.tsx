import { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EventAssessmentModal } from '@/components/EventAssessmentModal';
import { Event } from '@/lib/mockData';
import {
  Calendar,
  MapPin,
  ExternalLink,
  CheckCircle,
  Zap,
  GraduationCap,
  Code,
} from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const typeConfig = {
  hackathon: {
    icon: Code,
    color: 'bg-accent/10 text-accent-foreground border-accent/20',
  },
  bootcamp: {
    icon: GraduationCap,
    color: 'bg-success/10 text-success border-success/20',
  },
  workshop: {
    icon: Zap,
    color: 'bg-info/10 text-info border-info/20',
  },
};

export default function Events() {
  const { events, markEventCompleted, updateSkillScore, skills } = useApp();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isAssessmentOpen, setIsAssessmentOpen] = useState(false);

  const upcomingEvents = events.filter((e) => !e.completed);
  const completedEvents = events.filter((e) => e.completed);

  const handleStartCompletion = (event: Event) => {
    setSelectedEvent(event);
    setIsAssessmentOpen(true);
  };

  const handleAssessmentComplete = (eventId: string, scoreGain: number) => {
    // Mark the event as completed
    markEventCompleted(eventId);

    // Update skills based on the event's relevant skills
    const event = events.find((e) => e.id === eventId);
    if (event) {
      event.relevantSkills.forEach((skillName) => {
        const skill = skills.find(
          (s) => s.name.toLowerCase() === skillName.toLowerCase()
        );
        if (skill) {
          const newScore = Math.min(100, skill.score + scoreGain);
          updateSkillScore(skill.id, newScore);
        }
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
      <motion.div variants={itemVariants}>
        <h1 className="font-display text-3xl font-bold text-foreground">Events & Learning</h1>
        <p className="text-muted-foreground mt-1">
          Discover events tailored to help you close your skill gaps.
        </p>
      </motion.div>

      {/* Recommended Events */}
      <motion.div variants={itemVariants}>
        <h2 className="font-display text-xl font-semibold text-foreground mb-4">
          Recommended for You
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {upcomingEvents.map((event) => {
            const config = typeConfig[event.type];
            const Icon = config.icon;

            return (
              <Card
                key={event.id}
                className="overflow-hidden hover:border-primary/20 transition-colors"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${config.color}`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <Badge variant="outline" className={config.color}>
                      {event.type}
                    </Badge>
                  </div>

                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                    {event.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">{event.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {event.relevantSkills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      {event.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      {event.location}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center gap-2">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Skill Gap Match: </span>
                        <span className="font-semibold text-primary">{event.skillGapMatch}%</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="gap-1.5">
                        <ExternalLink className="w-4 h-4" /> View
                      </Button>
                      <Button size="sm" onClick={() => handleStartCompletion(event)}>
                        Mark Complete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {upcomingEvents.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No upcoming events. Check back later!</p>
            </CardContent>
          </Card>
        )}
      </motion.div>

      {/* Completed Events */}
      {completedEvents.length > 0 && (
        <motion.div variants={itemVariants}>
          <h2 className="font-display text-xl font-semibold text-foreground mb-4">
            Completed
          </h2>
          <div className="space-y-4">
            {completedEvents.map((event) => {
              const config = typeConfig[event.type];
              const Icon = config.icon;

              return (
                <Card key={event.id} className="bg-secondary/30">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${config.color}`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground">{event.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {event.date} • {event.location}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-success">
                        <CheckCircle className="w-5 h-5" />
                        <span className="text-sm font-medium">Completed</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Assessment Modal */}
      <EventAssessmentModal
        event={selectedEvent}
        isOpen={isAssessmentOpen}
        onClose={() => {
          setIsAssessmentOpen(false);
          setSelectedEvent(null);
        }}
        onComplete={handleAssessmentComplete}
      />
    </motion.div>
  );
}
