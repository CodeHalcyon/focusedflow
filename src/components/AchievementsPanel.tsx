import { Trophy, Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAchievements } from '@/hooks/useAchievements';
import { Achievement } from '@/data/achievements';
import { cn } from '@/lib/utils';

interface AchievementsPanelProps {
  stats: {
    streak: number;
    totalHours: number;
    completedTasks: number;
  };
}

function AchievementCard({
  achievement,
  isUnlocked,
  progress,
}: {
  achievement: Achievement;
  isUnlocked: boolean;
  progress: number;
}) {
  return (
    <div
      className={cn(
        'p-4 rounded-xl border transition-all',
        isUnlocked
          ? 'bg-primary/5 border-primary/20'
          : 'bg-muted/30 border-muted opacity-70'
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            'text-3xl flex-shrink-0',
            !isUnlocked && 'grayscale opacity-50'
          )}
        >
          {achievement.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-sm truncate">{achievement.name}</h4>
            {isUnlocked ? (
              <Trophy className="h-3.5 w-3.5 text-primary flex-shrink-0" />
            ) : (
              <Lock className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
            )}
          </div>
          <p className="text-xs text-muted-foreground mb-2">
            {achievement.description}
          </p>
          {!isUnlocked && (
            <div className="space-y-1">
              <Progress value={progress} className="h-1.5" />
              <p className="text-xs text-muted-foreground">
                {Math.round(progress)}% complete
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function AchievementsPanel({ stats }: AchievementsPanelProps) {
  const { achievements, getUnlockedAchievements, getLockedAchievements, getProgress } =
    useAchievements();

  const unlocked = getUnlockedAchievements();
  const locked = getLockedAchievements();

  const streakAchievements = achievements.filter((a) => a.category === 'streak');
  const timeAchievements = achievements.filter((a) => a.category === 'time');
  const taskAchievements = achievements.filter((a) => a.category === 'tasks');

  const renderAchievements = (list: Achievement[]) => (
    <div className="grid gap-3 sm:grid-cols-2">
      {list.map((achievement) => (
        <AchievementCard
          key={achievement.id}
          achievement={achievement}
          isUnlocked={unlocked.some((u) => u.id === achievement.id)}
          progress={getProgress(achievement, stats)}
        />
      ))}
    </div>
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Achievements
          </CardTitle>
          <span className="text-sm text-muted-foreground">
            {unlocked.length}/{achievements.length} unlocked
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
            <TabsTrigger value="streak" className="text-xs">🔥 Streak</TabsTrigger>
            <TabsTrigger value="time" className="text-xs">⏱️ Time</TabsTrigger>
            <TabsTrigger value="tasks" className="text-xs">✅ Tasks</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-0">
            {renderAchievements(achievements)}
          </TabsContent>
          <TabsContent value="streak" className="mt-0">
            {renderAchievements(streakAchievements)}
          </TabsContent>
          <TabsContent value="time" className="mt-0">
            {renderAchievements(timeAchievements)}
          </TabsContent>
          <TabsContent value="tasks" className="mt-0">
            {renderAchievements(taskAchievements)}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
