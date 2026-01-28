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
  Briefcase,
  MapPin,
  DollarSign,
  Users,
  TrendingUp,
  Plus,
  Trash2,
  Send,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { JobRole } from '@/lib/mockData';
import { toast } from '@/hooks/use-toast';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const skillOptions = [
  { id: '1', name: 'JavaScript' },
  { id: '2', name: 'TypeScript' },
  { id: '3', name: 'React' },
  { id: '4', name: 'Node.js' },
  { id: '5', name: 'System Design' },
  { id: '6', name: 'Data Structures' },
  { id: '7', name: 'APIs & REST' },
  { id: '8', name: 'Python' },
  { id: '9', name: 'Machine Learning' },
  { id: '10', name: 'AWS' },
];

export default function JobRoles() {
  const { 
    jobRoles, 
    addJobRole, 
    removeJobRole, 
    sendJobApplications,
    jobApplications,
    candidates,
    getAcceptedCandidatesForJob,
  } = useApp();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<{ id: string; name: string; weight: number; minScore: number }[]>([]);
  const [newRole, setNewRole] = useState({
    title: '',
    company: 'Your Company',
    description: '',
    location: '',
    salaryRange: '',
  });

  const handleAddSkill = (skillId: string, skillName: string) => {
    if (selectedSkills.find((s) => s.id === skillId)) return;
    setSelectedSkills([...selectedSkills, { id: skillId, name: skillName, weight: 20, minScore: 60 }]);
  };

  const handleRemoveSkill = (skillId: string) => {
    setSelectedSkills(selectedSkills.filter((s) => s.id !== skillId));
  };

  const handleUpdateSkillWeight = (skillId: string, weight: number) => {
    setSelectedSkills(
      selectedSkills.map((s) => (s.id === skillId ? { ...s, weight } : s))
    );
  };

  const handleUpdateSkillMinScore = (skillId: string, minScore: number) => {
    setSelectedSkills(
      selectedSkills.map((s) => (s.id === skillId ? { ...s, minScore } : s))
    );
  };

  const handleCreateRole = () => {
    if (!newRole.title || !newRole.location || selectedSkills.length === 0) {
      toast({
        title: 'Missing fields',
        description: 'Please fill in all required fields and add at least one skill.',
        variant: 'destructive',
      });
      return;
    }

    const totalWeight = selectedSkills.reduce((sum, s) => sum + s.weight, 0);
    if (totalWeight !== 100) {
      toast({
        title: 'Invalid weights',
        description: `Skill weights must total 100%. Current total: ${totalWeight}%`,
        variant: 'destructive',
      });
      return;
    }

    const jobRole: JobRole = {
      id: `job-${Date.now()}`,
      title: newRole.title,
      company: newRole.company,
      description: newRole.description,
      location: newRole.location,
      salaryRange: newRole.salaryRange,
      postedAt: new Date().toISOString().split('T')[0],
      requiredSkills: selectedSkills.map((s) => ({
        skillId: s.id,
        name: s.name,
        weight: s.weight,
        minScore: s.minScore,
      })),
    };

    addJobRole(jobRole);
    toast({
      title: 'Job role created',
      description: 'You can now find matching candidates.',
    });

    // Reset form
    setNewRole({
      title: '',
      company: 'Your Company',
      description: '',
      location: '',
      salaryRange: '',
    });
    setSelectedSkills([]);
    setIsDialogOpen(false);
  };

  const handleFindCandidates = (jobRoleId: string) => {
    sendJobApplications(jobRoleId);
    toast({
      title: 'Notifications sent',
      description: 'Eligible candidates have been notified. They can accept or decline the opportunity.',
    });
  };

  const handleRemoveRole = (jobRoleId: string) => {
    removeJobRole(jobRoleId);
    toast({
      title: 'Job role removed',
      description: 'The job role has been deleted.',
    });
  };

  const getApplicationStats = (jobRoleId: string) => {
    const apps = jobApplications.filter((app) => app.jobRoleId === jobRoleId);
    return {
      pending: apps.filter((a) => a.status === 'pending').length,
      accepted: apps.filter((a) => a.status === 'accepted').length,
      declined: apps.filter((a) => a.status === 'declined').length,
    };
  };

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
            Manage job descriptions and find matching candidates.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" /> Post New Role
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Job Role</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Software Engineer"
                    value={newRole.title}
                    onChange={(e) => setNewRole({ ...newRole, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={newRole.company}
                    onChange={(e) => setNewRole({ ...newRole, company: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the role..."
                  value={newRole.description}
                  onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Remote, San Francisco"
                    value={newRole.location}
                    onChange={(e) => setNewRole({ ...newRole, location: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salary">Salary Range</Label>
                  <Input
                    id="salary"
                    placeholder="e.g., $120k - $150k"
                    value={newRole.salaryRange}
                    onChange={(e) => setNewRole({ ...newRole, salaryRange: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Required Skills (weights must total 100%)</Label>
                <div className="flex flex-wrap gap-2 mb-4">
                  {skillOptions
                    .filter((s) => !selectedSkills.find((ss) => ss.id === s.id))
                    .map((skill) => (
                      <Badge
                        key={skill.id}
                        variant="outline"
                        className="cursor-pointer hover:bg-primary/10"
                        onClick={() => handleAddSkill(skill.id, skill.name)}
                      >
                        + {skill.name}
                      </Badge>
                    ))}
                </div>

                {selectedSkills.length > 0 && (
                  <div className="space-y-3 p-4 bg-secondary/50 rounded-xl">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Selected Skills</span>
                      <span>
                        Total Weight: {selectedSkills.reduce((sum, s) => sum + s.weight, 0)}%
                      </span>
                    </div>
                    {selectedSkills.map((skill) => (
                      <div
                        key={skill.id}
                        className="flex items-center gap-4 p-3 bg-background rounded-lg border border-border"
                      >
                        <span className="flex-1 font-medium">{skill.name}</span>
                        <div className="flex items-center gap-2">
                          <Label className="text-xs">Weight %</Label>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            className="w-20"
                            value={skill.weight}
                            onChange={(e) =>
                              handleUpdateSkillWeight(skill.id, parseInt(e.target.value) || 0)
                            }
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Label className="text-xs">Min %</Label>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            className="w-20"
                            value={skill.minScore}
                            onChange={(e) =>
                              handleUpdateSkillMinScore(skill.id, parseInt(e.target.value) || 0)
                            }
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveSkill(skill.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Button onClick={handleCreateRole} className="w-full">
                Create Job Role
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
                <p className="text-sm text-muted-foreground">Total Applicants</p>
                <p className="text-3xl font-display font-bold text-foreground mt-1">
                  {jobApplications.filter((a) => a.status === 'accepted').length}
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
                <p className="text-sm text-muted-foreground">Pending Responses</p>
                <p className="text-3xl font-display font-bold text-foreground mt-1">
                  {jobApplications.filter((a) => a.status === 'pending').length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-info" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Job Roles List */}
      <motion.div variants={itemVariants} className="space-y-4">
        {jobRoles.map((role) => {
          const stats = getApplicationStats(role.id);

          return (
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
                      {role.salaryRange && (
                        <span className="flex items-center gap-1.5">
                          <DollarSign className="w-4 h-4" />
                          {role.salaryRange}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {role.requiredSkills.map((skill) => (
                        <Badge key={skill.skillId} variant="outline" className="text-xs">
                          {skill.name} ({skill.weight}% • min: {skill.minScore}%)
                        </Badge>
                      ))}
                    </div>

                    {/* Application Stats */}
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1.5 text-success">
                        <CheckCircle className="w-4 h-4" />
                        {stats.accepted} accepted
                      </span>
                      <span className="flex items-center gap-1.5 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {stats.pending} pending
                      </span>
                    </div>
                  </div>

                  <div className="text-right ml-4">
                    <p className="text-sm text-muted-foreground">Posted</p>
                    <p className="text-lg font-semibold text-foreground">{role.postedAt}</p>
                  </div>
                </div>

                <div className="flex gap-3 mt-4 pt-4 border-t border-border">
                  <Button
                    size="sm"
                    className="gap-2"
                    onClick={() => handleFindCandidates(role.id)}
                  >
                    <Send className="w-4 h-4" />
                    Find & Notify Candidates
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    View Applicants ({stats.accepted})
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleRemoveRole(role.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {jobRoles.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No job roles yet. Create one to get started!</p>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </motion.div>
  );
}
