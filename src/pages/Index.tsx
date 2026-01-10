import { Navigation } from '@/components/Navigation';
import { Clock } from '@/components/Clock';
import { ClockSettingsPanel } from '@/components/ClockSettings';
import { WorkTimer } from '@/components/WorkTimer';
import { TaskList } from '@/components/TaskList';
import { DailyQuote } from '@/components/DailyQuote';
import { DailySummary } from '@/components/DailySummary';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useWorkData } from '@/hooks/useWorkData';
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
  } = useWorkData();

  const today = new Date();
  const dateString = format(today, 'EEEE, MMMM d');

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
          <section>
            <DailySummary data={todayData} />
          </section>
        </div>
      </main>
    </div>
  );
};

export default Index;
