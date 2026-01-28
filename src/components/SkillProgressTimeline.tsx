import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Calendar, Award } from 'lucide-react';
import { Skill } from '@/lib/mockData';

interface SkillProgressTimelineProps {
  skills: Skill[];
  skillHistory: SkillHistoryEntry[];
}

export interface SkillHistoryEntry {
  date: string;
  skillId: string;
  skillName: string;
  oldScore: number;
  newScore: number;
  source: 'assessment' | 'event';
  eventName?: string;
}

// Generate mock history based on current skills
export function generateMockHistory(skills: Skill[]): SkillHistoryEntry[] {
  const history: SkillHistoryEntry[] = [];
  const dates = [
    '2024-01-01',
    '2024-01-08',
    '2024-01-15',
    '2024-01-22',
    '2024-01-28',
  ];

  skills.forEach((skill) => {
    // Generate a progression for each skill
    let currentScore = Math.max(30, skill.score - 40); // Start lower
    dates.forEach((date, index) => {
      if (index === 0) {
        history.push({
          date,
          skillId: skill.id,
          skillName: skill.name,
          oldScore: 0,
          newScore: currentScore,
          source: 'assessment',
        });
      } else {
        const gain = Math.floor(Math.random() * 15) + 5;
        const newScore = Math.min(skill.score, currentScore + gain);
        if (newScore > currentScore) {
          history.push({
            date,
            skillId: skill.id,
            skillName: skill.name,
            oldScore: currentScore,
            newScore,
            source: index % 2 === 0 ? 'assessment' : 'event',
            eventName: index % 2 !== 0 ? 'Workshop completion' : undefined,
          });
          currentScore = newScore;
        }
      }
    });
  });

  return history.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

const SKILL_COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--success))',
  'hsl(var(--warning))',
  'hsl(var(--info))',
  'hsl(171, 77%, 40%)',
  'hsl(262, 83%, 58%)',
  'hsl(25, 95%, 53%)',
  'hsl(340, 75%, 55%)',
];

export function SkillProgressTimeline({ skills, skillHistory }: SkillProgressTimelineProps) {
  // Transform history into chart data
  const chartData = useMemo(() => {
    const dateMap = new Map<string, Record<string, number>>();
    
    skillHistory.forEach((entry) => {
      const existing = dateMap.get(entry.date) || {};
      existing[entry.skillName] = entry.newScore;
      dateMap.set(entry.date, existing);
    });

    // Fill in missing values with previous values
    const dates = Array.from(dateMap.keys()).sort();
    const result: Record<string, number | string>[] = [];
    const lastValues: Record<string, number> = {};

    dates.forEach((date) => {
      const dataPoint: Record<string, number | string> = { date: formatDate(date) };
      skills.forEach((skill) => {
        const currentValue = dateMap.get(date)?.[skill.name];
        if (currentValue !== undefined) {
          lastValues[skill.name] = currentValue;
        }
        dataPoint[skill.name] = lastValues[skill.name] || 0;
      });
      result.push(dataPoint);
    });

    return result;
  }, [skillHistory, skills]);

  // Recent improvements
  const recentImprovements = useMemo(() => {
    return skillHistory
      .filter((entry) => entry.oldScore > 0)
      .slice(-5)
      .reverse();
  }, [skillHistory]);

  // Total improvement
  const totalImprovement = useMemo(() => {
    const improvements: Record<string, number> = {};
    skillHistory.forEach((entry) => {
      if (!improvements[entry.skillName]) {
        improvements[entry.skillName] = 0;
      }
      improvements[entry.skillName] = entry.newScore - (entry.oldScore || entry.newScore);
    });
    return Object.entries(improvements)
      .map(([name, gain]) => ({ name, gain }))
      .filter((item) => item.gain > 0)
      .sort((a, b) => b.gain - a.gain);
  }, [skillHistory]);

  return (
    <div className="space-y-6">
      {/* Progress Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Skill Progress Over Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis
                  dataKey="date"
                  className="text-xs fill-muted-foreground"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis
                  domain={[0, 100]}
                  className="text-xs fill-muted-foreground"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Legend />
                {skills.slice(0, 6).map((skill, index) => (
                  <Line
                    key={skill.id}
                    type="monotone"
                    dataKey={skill.name}
                    stroke={SKILL_COLORS[index % SKILL_COLORS.length]}
                    strokeWidth={2}
                    dot={{ fill: SKILL_COLORS[index % SKILL_COLORS.length], r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Stats Row */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Top Improvements */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <Award className="w-5 h-5 text-success" />
              Top Improvements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {totalImprovement.slice(0, 4).map((item, index) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-foreground">
                      #{index + 1}
                    </span>
                    <span className="text-sm text-foreground">{item.name}</span>
                  </div>
                  <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                    +{item.gain}%
                  </Badge>
                </div>
              ))}
              {totalImprovement.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Complete assessments and events to see improvements
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentImprovements.map((entry, index) => (
                <div
                  key={`${entry.skillId}-${entry.date}-${index}`}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground truncate">
                        {entry.skillName}
                      </span>
                      <Badge
                        variant="outline"
                        className={
                          entry.source === 'event'
                            ? 'bg-info/10 text-info border-info/20'
                            : 'bg-primary/10 text-primary border-primary/20'
                        }
                      >
                        {entry.source}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatDate(entry.date)}
                      {entry.eventName && ` • ${entry.eventName}`}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <span className="text-sm text-muted-foreground">
                      {entry.oldScore}%
                    </span>
                    <span className="text-sm text-foreground mx-1">→</span>
                    <span className="text-sm font-medium text-success">
                      {entry.newScore}%
                    </span>
                  </div>
                </div>
              ))}
              {recentImprovements.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No recent activity
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}
