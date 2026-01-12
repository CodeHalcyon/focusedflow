import { useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Clock } from '@/components/Clock';
import { ClockSettingsPanel } from '@/components/ClockSettings';
import { WorkTimer } from '@/components/WorkTimer';
import { TaskList } from '@/components/TaskList';
import { DailyQuote } from '@/components/DailyQuote';
import { DailySummary } from '@/components/DailySummary';
import { ShareableStatsCard } from '@/components/ShareableStatsCard';
import { DailyGoalProgress } from '@/components/DailyGoalProgress';
import { AchievementsPanel } from '@/components/AchievementsPanel';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useWorkData } from '@/hooks/useWorkData';
import { useAchievements } from '@/hooks/useAchievements';
import type { ClockSettings } from '@/types';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';

const defaultClockSettings: ClockSettings = {
  theme: 'neon',
  size: 'large',
  showSeconds: true,
  use24Hour: false,
  fontWeight: 'semibold',
};

const Index = () => {
  const [clockSettings, setClockSettings] = useLocalStorage<ClockSettings>(
    'clockSettings',
    defaultClockSettings
  );
  
  const {
    todayData,
    loading,
    addTask,
    toggleTask,
    deleteTask,
    startWork,
    stopWork,
    getStreak,
    getTotalStats,
  } = useWorkData();

  const { checkAndUnlock } = useAchievements();

  const today = new Date();
  const dateString = format(today, 'EEEE, MMMM d');

  const streak = getStreak();
  const { totalHours, completedTasks } = getTotalStats();
  const stats = { streak, totalHours, completedTasks };

  // Check for new achievements when stats change
  useEffect(() => {
    if (!loading) {
      checkAndUnlock(stats);
    }
  }, [loading, streak, totalHours, completedTasks]);

  // Convert today's duration from seconds to minutes for goal progress
  const todayMinutes = Math.floor(todayData.workSession.duration / 60);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="pt-20 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="pt-20 pb-12 px-4">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Header with date and clock settings */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{dateString}</p>
            </div>
            <ClockSettingsPanel
              settings={clockSettings}
              onSettingsChange={setClockSettings}
            />
          </div>

          {/* Main Clock */}
          <section className="py-12 flex flex-col items-center">
            <Clock settings={clockSettings} />
          </section>

          {/* Daily Quote */}
          <section className="py-6">
            <DailyQuote />
          </section>

          {/* Daily Goal Progress */}
          <section className="bg-card rounded-xl border p-4">
            <DailyGoalProgress currentMinutes={todayMinutes} />
          </section>

          {/* Work Timer */}
          <section>
            <WorkTimer
              session={todayData.workSession}
              onStart={startWork}
              onStop={stopWork}
            />
          </section>

          {/* Tasks */}
          <section>
            <TaskList
              tasks={todayData.tasks}
              onAddTask={addTask}
              onToggleTask={toggleTask}
              onDeleteTask={deleteTask}
            />
          </section>

          {/* Daily Summary */}
          <section className="space-y-4">
            <DailySummary data={todayData} />
            <div className="flex justify-center">
              <ShareableStatsCard />
            </div>
          </section>

          {/* Achievements */}
          <section>
            <AchievementsPanel stats={stats} />
          </section>
        </div>
      </main>
    </div>
  );
};

export default Index;
