import { useState } from 'react';
import { Target, Pencil, Check } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useDailyGoal } from '@/hooks/useDailyGoal';
import { toast } from 'sonner';

interface DailyGoalProgressProps {
  currentMinutes: number;
}

const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  }
  return `${mins}m`;
};

export function DailyGoalProgress({ currentMinutes }: DailyGoalProgressProps) {
  const { goalMinutes, updateGoal, getProgress } = useDailyGoal();
  const [editValue, setEditValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const progress = getProgress(currentMinutes);
  const isComplete = progress >= 100;

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      setEditValue(goalMinutes.toString());
    }
  };

  const handleSave = async () => {
    const minutes = parseInt(editValue, 10);
    if (isNaN(minutes) || minutes < 1 || minutes > 1440) {
      toast.error('Goal must be between 1 minute and 24 hours');
      return;
    }
    await updateGoal(minutes);
    setIsOpen(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className={`h-4 w-4 ${isComplete ? 'text-green-500' : 'text-primary'}`} />
          <span className="text-sm font-medium">Daily Focus Goal</span>
        </div>
        <Popover open={isOpen} onOpenChange={handleOpenChange}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
              <Pencil className="h-3 w-3 mr-1" />
              {formatDuration(goalMinutes)}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-3" align="end">
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">
                Goal (minutes)
              </label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  min="1"
                  max="1440"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="h-8"
                  placeholder="60"
                />
                <Button size="sm" className="h-8 px-2" onClick={handleSave}>
                  <Check className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex gap-1 flex-wrap">
                {[30, 60, 90, 120, 180, 240].map((m) => (
                  <Button
                    key={m}
                    variant="outline"
                    size="sm"
                    className="h-6 text-xs px-2"
                    onClick={() => setEditValue(m.toString())}
                  >
                    {formatDuration(m)}
                  </Button>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="space-y-1">
        <Progress 
          value={progress} 
          className={`h-2 ${isComplete ? '[&>div]:bg-green-500' : ''}`} 
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatDuration(currentMinutes)}</span>
          <span>
            {isComplete ? (
              <span className="text-green-500 font-medium">Goal reached! 🎉</span>
            ) : (
              `${formatDuration(Math.max(0, goalMinutes - currentMinutes))} remaining`
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
