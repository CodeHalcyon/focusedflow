import { useState, useEffect } from 'react';
import { Play, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatTime } from '@/lib/dateUtils';
import type { WorkSession } from '@/types';
import { cn } from '@/lib/utils';

interface WorkTimerProps {
  session: WorkSession;
  onStart: () => void;
  onStop: () => void;
}

export function WorkTimer({ session, onStart, onStop }: WorkTimerProps) {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (session.isActive && session.startTime) {
      const startTime = new Date(session.startTime).getTime();
      
      const updateElapsed = () => {
        const now = Date.now();
        setElapsedTime(session.duration + Math.floor((now - startTime) / 1000));
      };

      updateElapsed();
      const interval = setInterval(updateElapsed, 1000);
      return () => clearInterval(interval);
    } else {
      setElapsedTime(session.duration);
    }
  }, [session.isActive, session.startTime, session.duration]);

  return (
    <div className="glass rounded-xl p-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">
            {session.isActive ? 'Working' : 'Today\'s Work'}
          </p>
          <p className={cn(
            'font-mono text-2xl md:text-3xl tabular-nums transition-colors',
            session.isActive ? 'text-primary' : 'text-foreground'
          )}>
            {formatTime(elapsedTime)}
          </p>
        </div>
        
        {session.isActive ? (
          <Button
            onClick={onStop}
            variant="destructive"
            size="lg"
            className="gap-2"
          >
            <Square className="h-4 w-4" />
            Stop
          </Button>
        ) : (
          <Button
            onClick={onStart}
            size="lg"
            className="gap-2"
          >
            <Play className="h-4 w-4" />
            Start Work
          </Button>
        )}
      </div>
      
      {session.isActive && (
        <div className="mt-4 flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          <span className="text-xs text-muted-foreground">Session in progress</span>
        </div>
      )}
    </div>
  );
}
