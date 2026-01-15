import { useState, useRef, useEffect } from 'react';
import { Plus, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import type { Task } from '@/types';
import { cn } from '@/lib/utils';
import { ShareableStatsCard } from './ShareableStatsCard';

interface TaskListProps {
  tasks: Task[];
  onAddTask: (text: string) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

export function TaskList({ tasks, onAddTask, onToggleTask, onDeleteTask }: TaskListProps) {
  const [newTask, setNewTask] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAdding && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAdding]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim()) {
      onAddTask(newTask.trim());
      setNewTask('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsAdding(false);
      setNewTask('');
    }
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;

  return (
    <div className="glass rounded-xl p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="space-y-1">
          <h3 className="text-sm font-medium">Today's Tasks</h3>
          {totalCount > 0 && (
            <p className="text-xs text-muted-foreground">
              {completedCount} of {totalCount} completed
            </p>
          )}
        </div>
        {!isAdding && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAdding(true)}
            className="gap-1 text-muted-foreground hover:text-foreground"
          >
            <Plus className="h-4 w-4" />
            Add
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {isAdding && (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              ref={inputRef}
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="What needs to be done?"
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={!newTask.trim()}>
              <Check className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => {
                setIsAdding(false);
                setNewTask('');
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </form>
        )}

        {tasks.length === 0 && !isAdding ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No tasks yet. Add one to get started!
          </p>
        ) : (
          <ul className="space-y-1">
            {tasks.map((task) => (
              <li
                key={task.id}
                className={cn(
                  'group flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                  'hover:bg-muted/50'
                )}
              >
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => onToggleTask(task.id)}
                />
                <span
                  className={cn(
                    'flex-1 text-sm transition-all',
                    task.completed && 'line-through text-muted-foreground'
                  )}
                >
                  {task.text}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                  onClick={() => onDeleteTask(task.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
