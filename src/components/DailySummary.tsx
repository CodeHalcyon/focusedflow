import { Clock, CheckCircle2, XCircle } from 'lucide-react';
import { formatDuration } from '@/lib/dateUtils';
import type { DayData } from '@/types';

interface DailySummaryProps {
  data: DayData;
}

export function DailySummary({ data }: DailySummaryProps) {
  const completedTasks = data.tasks.filter(t => t.completed).length;
  const incompleteTasks = data.tasks.filter(t => !t.completed).length;
  const totalDuration = data.workSession.duration;

  if (totalDuration === 0 && data.tasks.length === 0) {
    return null;
  }

  return (
    <div className="glass rounded-xl p-6 animate-fade-in">
      <h3 className="text-sm font-medium mb-4">Today's Summary</h3>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 mb-2">
            <Clock className="h-5 w-5 text-primary" />
          </div>
          <p className="text-xl font-mono font-semibold">
            {totalDuration > 0 ? formatDuration(totalDuration) : '0m'}
          </p>
          <p className="text-xs text-muted-foreground">Work Time</p>
        </div>
        
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-success/10 mb-2">
            <CheckCircle2 className="h-5 w-5 text-success" />
          </div>
          <p className="text-xl font-mono font-semibold">{completedTasks}</p>
          <p className="text-xs text-muted-foreground">Completed</p>
        </div>
        
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-muted mb-2">
            <XCircle className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="text-xl font-mono font-semibold">{incompleteTasks}</p>
          <p className="text-xs text-muted-foreground">Remaining</p>
        </div>
      </div>
    </div>
  );
}
