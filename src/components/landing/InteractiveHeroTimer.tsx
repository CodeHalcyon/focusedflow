import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const demoTasks = [
  { id: 1, text: "Review pull requests", completed: true },
  { id: 2, text: "Ship feature update", completed: true },
  { id: 3, text: "Write documentation", completed: false },
];

export function InteractiveHeroTimer() {
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [tasks, setTasks] = useState(demoTasks);
  const [showPulse, setShowPulse] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleToggle = () => {
    setIsRunning(!isRunning);
    setShowPulse(true);
    setTimeout(() => setShowPulse(false), 400);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSeconds(0);
    setTasks(demoTasks);
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  return (
    <div className="relative">
      {/* Glowing ring when running */}
      <div 
        className={`absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary via-secondary to-primary opacity-0 blur-xl transition-opacity duration-500 ${isRunning ? 'opacity-30 animate-pulse' : ''}`}
      />
      
      <div className="relative glass rounded-2xl p-8 glow-primary overflow-hidden">
        {/* Live indicator */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm text-muted-foreground">Try it now — click to start</span>
          <span className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${isRunning ? 'text-success' : 'text-muted-foreground'}`}>
            <span className={`w-2 h-2 rounded-full ${isRunning ? 'bg-success animate-pulse' : 'bg-muted-foreground'}`} />
            {isRunning ? 'Recording' : 'Paused'}
          </span>
        </div>

        {/* Timer display with pulse effect */}
        <div className="text-center py-6 relative">
          <div 
            className={`absolute inset-0 bg-primary/10 rounded-full blur-3xl transition-transform duration-300 ${showPulse ? 'scale-150 opacity-100' : 'scale-100 opacity-0'}`}
          />
          <button
            onClick={handleToggle}
            className="relative font-mono text-6xl md:text-7xl font-bold text-gradient cursor-pointer transition-transform duration-200 hover:scale-105 active:scale-95"
          >
            {formatTime(seconds)}
          </button>
          <p className="text-muted-foreground mt-3 text-sm">
            {isRunning ? "Focus session in progress..." : "Click the timer to start"}
          </p>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-3 mb-6">
          <Button 
            size="sm" 
            variant={isRunning ? "destructive" : "default"}
            onClick={handleToggle}
            className="gap-2 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {isRunning ? "Pause" : "Start"}
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleReset}
            className="gap-2 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>

        {/* Interactive task list */}
        <div className="space-y-2">
          {tasks.map(task => (
            <button
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                task.completed 
                  ? 'bg-success/10 border border-success/20' 
                  : 'bg-muted/50 border border-transparent hover:border-primary/30'
              }`}
            >
              <div className={`flex-shrink-0 transition-all duration-300 ${task.completed ? 'text-success scale-110' : 'text-muted-foreground'}`}>
                {task.completed ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <div className="h-5 w-5 rounded border-2 border-muted-foreground" />
                )}
              </div>
              <span className={`text-sm transition-all duration-200 ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                {task.text}
              </span>
            </button>
          ))}
        </div>

        {/* Progress hint */}
        <div className="mt-4 pt-4 border-t border-border/40">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{tasks.filter(t => t.completed).length}/{tasks.length} tasks</span>
            <span>{formatTime(seconds)} focused</span>
          </div>
          <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300"
              style={{ width: `${(tasks.filter(t => t.completed).length / tasks.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
