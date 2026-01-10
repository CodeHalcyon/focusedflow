import { Navigation } from '@/components/Navigation';
import { useWorkData } from '@/hooks/useWorkData';
import { formatDuration, getDateLabel } from '@/lib/dateUtils';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Flame, Clock, CheckCircle2, TrendingUp, Loader2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';

const Analytics = () => {
  const { getRecentDays, getStreak, loading } = useWorkData();
  
  const recentDays = getRecentDays(14);
  const streak = getStreak();
  
  // Calculate totals
  const totalWorkHours = recentDays.reduce((acc, day) => acc + day.workSession.duration, 0);
  const totalTasks = recentDays.reduce((acc, day) => acc + day.tasks.length, 0);
  const completedTasks = recentDays.reduce((acc, day) => acc + day.tasks.filter(t => t.completed).length, 0);
  const daysWorked = recentDays.filter(day => day.workSession.duration > 0).length;

  // Chart data
  const workChartData = recentDays.map(day => ({
    date: format(parseISO(day.date), 'MMM d'),
    hours: Math.round((day.workSession.duration / 3600) * 10) / 10,
    fullDate: day.date,
  }));

  const taskChartData = recentDays.map(day => ({
    date: format(parseISO(day.date), 'MMM d'),
    completed: day.tasks.filter(t => t.completed).length,
    incomplete: day.tasks.filter(t => !t.completed).length,
    fullDate: day.date,
  }));

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
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <h1 className="text-2xl font-semibold">Analytics</h1>
            <p className="text-muted-foreground">Your productivity over the last 14 days</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass rounded-xl p-5 animate-fade-in">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Flame className="h-5 w-5 text-primary" />
                </div>
              </div>
              <p className="text-3xl font-mono font-bold">{streak}</p>
              <p className="text-sm text-muted-foreground">Day Streak</p>
            </div>

            <div className="glass rounded-xl p-5 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-secondary" />
                </div>
              </div>
              <p className="text-3xl font-mono font-bold">
                {Math.round(totalWorkHours / 3600)}h
              </p>
              <p className="text-sm text-muted-foreground">Total Hours</p>
            </div>

            <div className="glass rounded-xl p-5 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                </div>
              </div>
              <p className="text-3xl font-mono font-bold">{completedTasks}</p>
              <p className="text-sm text-muted-foreground">Tasks Done</p>
            </div>

            <div className="glass rounded-xl p-5 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
              <p className="text-3xl font-mono font-bold">{daysWorked}</p>
              <p className="text-sm text-muted-foreground">Days Worked</p>
            </div>
          </div>

          {/* Work Hours Chart */}
          <div className="glass rounded-xl p-6 animate-fade-in">
            <h3 className="text-sm font-medium mb-6">Daily Work Hours</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={workChartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    className="text-xs fill-muted-foreground"
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    className="text-xs fill-muted-foreground"
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}h`}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="glass rounded-lg px-3 py-2 text-sm">
                            <p className="font-medium">{payload[0].payload.date}</p>
                            <p className="text-muted-foreground">
                              {payload[0].value}h worked
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar 
                    dataKey="hours" 
                    fill="hsl(var(--primary))" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Task Completion Chart */}
          <div className="glass rounded-xl p-6 animate-fade-in">
            <h3 className="text-sm font-medium mb-6">Daily Task Completion</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={taskChartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    className="text-xs fill-muted-foreground"
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    className="text-xs fill-muted-foreground"
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="glass rounded-lg px-3 py-2 text-sm">
                            <p className="font-medium">{payload[0].payload.date}</p>
                            <p className="text-success">
                              {payload[0].value} completed
                            </p>
                            <p className="text-muted-foreground">
                              {payload[1]?.value || 0} incomplete
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar 
                    dataKey="completed" 
                    stackId="tasks"
                    fill="hsl(var(--success))" 
                    radius={[0, 0, 0, 0]}
                  />
                  <Bar 
                    dataKey="incomplete" 
                    stackId="tasks"
                    fill="hsl(var(--muted))" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="glass rounded-xl p-6 animate-fade-in">
            <h3 className="text-sm font-medium mb-4">Recent Days</h3>
            <div className="space-y-3">
              {recentDays.slice().reverse().slice(0, 7).map((day) => {
                const completedCount = day.tasks.filter(t => t.completed).length;
                const totalTasks = day.tasks.length;
                const hours = Math.round((day.workSession.duration / 3600) * 10) / 10;
                
                return (
                  <div
                    key={day.date}
                    className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium">{getDateLabel(day.date)}</p>
                      <p className="text-xs text-muted-foreground">
                        {totalTasks > 0 
                          ? `${completedCount}/${totalTasks} tasks`
                          : 'No tasks'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-mono">
                        {hours > 0 ? `${hours}h` : '-'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Analytics;
