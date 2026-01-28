import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Target, ArrowRight, BrainCircuit } from 'lucide-react';
import { Skill } from '@/lib/mockData';

interface PendingAssessmentsProps {
    skills: Skill[];
}

export function PendingAssessments({ skills }: PendingAssessmentsProps) {
    const navigate = useNavigate();
    const pendingSkills = skills.filter((s) => s.status === 'pending');

    if (pendingSkills.length === 0) return null;

    return (
        <Card className="border-primary/20 bg-primary/5 mb-8">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <BrainCircuit className="w-5 h-5 text-primary" />
                    <CardTitle className="font-display text-lg">Pending Assessments</CardTitle>
                </div>
                <CardDescription>
                    Complete these assessments to verify your skills and unlock opportunities.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {pendingSkills.map((skill) => (
                        <div
                            key={skill.id}
                            className="bg-card border border-border rounded-xl p-4 flex items-center justify-between group hover:border-primary/30 transition-colors"
                        >
                            <div>
                                <p className="font-medium text-foreground">{skill.name}</p>
                                <Badge variant="secondary" className="mt-1 text-xs">
                                    {skill.category}
                                </Badge>
                            </div>
                            <Button
                                size="sm"
                                onClick={() => navigate('/assessments', { state: { skillId: skill.id, skillName: skill.name } })}
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                Start <ArrowRight className="w-4 h-4 ml-1" />
                            </Button>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
