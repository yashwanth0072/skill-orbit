import { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Calendar,
  MapPin,
  Plus,
  Trash2,
  Users,
  Code,
  GraduationCap,
  Zap,
} from 'lucide-react';
import { Event } from '@/lib/mockData';
import { toast } from '@/hooks/use-toast';

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

const skillOptions = [
  'JavaScript', 'TypeScript', 'React', 'Node.js', 'System Design',
  'Data Structures', 'APIs & REST', 'Python', 'Machine Learning',
  'AWS', 'Docker', 'Kubernetes',
];

export default function RecruiterEvents() {
  const { events, addEvent, removeEvent } = useApp();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    title: '',
    type: 'workshop',
    description: '',
    date: '',
    location: '',
    relevantSkills: [],
    skillGapMatch: 80,
    completed: false,
  });
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.date || !newEvent.location) {
      toast({
        title: 'Missing fields',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    const event: Event = {
      id: `event-${Date.now()}`,
      title: newEvent.title!,
      type: newEvent.type as 'hackathon' | 'bootcamp' | 'workshop',
      description: newEvent.description || '',
      date: newEvent.date!,
      location: newEvent.location!,
      relevantSkills: selectedSkills,
      skillGapMatch: newEvent.skillGapMatch || 80,
      completed: false,
    };

    addEvent(event);
    toast({
      title: 'Event created',
      description: 'The event has been added and is now visible to candidates.',
    });

    // Reset form
    setNewEvent({
      title: '',
      type: 'workshop',
      description: '',
      date: '',
      location: '',
      relevantSkills: [],
      skillGapMatch: 80,
      completed: false,
    });
    setSelectedSkills([]);
    setIsDialogOpen(false);
  };

  const handleRemoveEvent = (eventId: string) => {
    removeEvent(eventId);
    toast({
      title: 'Event removed',
      description: 'The event has been removed from the platform.',
    });
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const upcomingEvents = events.filter((e) => !e.completed);
  const completedEvents = events.filter((e) => e.completed);

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
          <h1 className="font-display text-3xl font-bold text-foreground">Event Management</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage events for candidates.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" /> Create Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., React Workshop"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Event Type *</Label>
                <Select
                  value={newEvent.type}
                  onValueChange={(value) => setNewEvent({ ...newEvent, type: value as Event['type'] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="workshop">Workshop</SelectItem>
                    <SelectItem value="bootcamp">Bootcamp</SelectItem>
                    <SelectItem value="hackathon">Hackathon</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the event..."
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Online"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Relevant Skills</Label>
                <div className="flex flex-wrap gap-2">
                  {skillOptions.map((skill) => (
                    <Badge
                      key={skill}
                      variant={selectedSkills.includes(skill) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => toggleSkill(skill)}
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button onClick={handleAddEvent} className="w-full">
                Create Event
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="gradient-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Events</p>
                <p className="text-3xl font-display font-bold text-foreground mt-1">
                  {upcomingEvents.length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-3xl font-display font-bold text-foreground mt-1">
                  {completedEvents.length}
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
                <p className="text-sm text-muted-foreground">Total Events</p>
                <p className="text-3xl font-display font-bold text-foreground mt-1">
                  {events.length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center">
                <Zap className="w-6 h-6 text-info" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Events List */}
      <motion.div variants={itemVariants}>
        <h2 className="font-display text-xl font-semibold text-foreground mb-4">
          Active Events
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {upcomingEvents.map((event) => {
            const config = typeConfig[event.type];
            const Icon = config.icon;

            return (
              <Card key={event.id} className="overflow-hidden hover:border-primary/20 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${config.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={config.color}>
                        {event.type}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive/80"
                        onClick={() => handleRemoveEvent(event.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
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

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      {event.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      {event.location}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {upcomingEvents.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No active events. Create one to get started!</p>
            </CardContent>
          </Card>
        )}
      </motion.div>

      {/* Completed Events */}
      {completedEvents.length > 0 && (
        <motion.div variants={itemVariants}>
          <h2 className="font-display text-xl font-semibold text-foreground mb-4">
            Completed Events
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
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${config.color}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground">{event.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {event.date} • {event.location}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive/80"
                        onClick={() => handleRemoveEvent(event.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
