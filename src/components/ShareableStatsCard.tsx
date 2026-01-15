import { useRef, useState } from 'react';
import { format } from 'date-fns';
import { Download, Share2, Flame, Clock, CheckCircle2, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useWorkData } from '@/hooks/useWorkData';
import { useToast } from '@/hooks/use-toast';

const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

export function ShareableStatsCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const { todayData, getStreak, getRecentDays } = useWorkData();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  const streak = getStreak();
  const recentDays = getRecentDays(7);
  
  const totalWeekMinutes = recentDays.reduce(
    (acc, day) => acc + day.workSession.duration,
    0
  );
  const completedTasks = todayData.tasks.filter((t) => t.completed).length;
  const totalTasks = todayData.tasks.length;

  const downloadImage = async () => {
    if (!cardRef.current) return;
    
    setIsGenerating(true);
    
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        backgroundColor: '#ffffff',
        useCORS: true,
      });
      
      const link = document.createElement('a');
      link.download = `focus-stats-${format(new Date(), 'yyyy-MM-dd')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      toast({
        title: "Image downloaded!",
        description: "Share your Focus stats on social media",
      });
    } catch (error) {
      console.error('Error generating image:', error);
      toast({
        title: "Error",
        description: "Failed to generate image",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const shareImage = async () => {
    if (!cardRef.current) return;
    
    if (!navigator.share) {
      downloadImage();
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        backgroundColor: '#ffffff',
        useCORS: true,
      });
      
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        
        const file = new File([blob], 'focus-stats.png', { type: 'image/png' });
        
        try {
          await navigator.share({
            files: [file],
            title: 'My Focus Stats',
            text: `I've been focused for ${formatDuration(todayData.workSession.duration)} today! 🔥`,
          });
        } catch (err) {
          // User cancelled or share failed, fallback to download
          downloadImage();
        }
      }, 'image/png');
    } catch (error) {
      console.error('Error sharing:', error);
      downloadImage();
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Share2 className="h-4 w-4" />
          Share Progress
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Your Focus</DialogTitle>
        </DialogHeader>
        
        {/* The shareable card - Strava style portrait */}
        <div className="flex justify-center py-4">
          <div
            ref={cardRef}
            className="w-[400px] aspect-[2/3] rounded-lg overflow-hidden relative bg-white"
            style={{
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            }}
          >
            {/* Content */}
            <div className="relative h-full flex flex-col p-6">
              {/* Header */}
              <div className="mb-4">
                <div className="flex items-center gap-3 mb-2">
                  <img src="/favicon.png" alt="Focus" className="h-8 w-8" />
                  <h2 className="text-gray-900 font-bold text-xl leading-tight">Focus</h2>
                </div>
                <p className="text-gray-500 text-xs">
                  {format(new Date(), 'EEEE, MMMM d, yyyy')}
                </p>
              </div>
              
              {/* Main stat - Large and prominent */}
              <div className="mb-6">
                <p className="text-gray-500 text-xs uppercase tracking-widest mb-2 font-semibold">
                  Today's Focus Time
                </p>
                <p 
                  className="text-6xl font-bold leading-none"
                  style={{ color: 'hsl(45, 93%, 47%)' }}
                >
                  {formatDuration(todayData.workSession.duration)}
                </p>
              </div>
              
              {/* Weekly Activity Chart - SVG Area Chart */}
              <div className="mb-6 flex-1 min-h-[180px]">
                <p className="text-gray-500 text-xs uppercase tracking-wide mb-3 font-semibold">Weekly Activity</p>
                <div className="relative w-full h-full">
                  <svg viewBox="0 0 300 180" className="w-full h-full">
                    {/* Calculate chart data */}
                    {(() => {
                      const maxDuration = Math.max(
                        ...recentDays.map((d) => d.workSession.duration),
                        1
                      );
                      const chartWidth = 280;
                      const chartHeight = 150;
                      const padding = 20;
                      const pointSpacing = chartWidth / (recentDays.length - 1);
                      
                      // Generate points for area chart
                      const points = recentDays.map((day, i) => {
                        const x = padding + (i * pointSpacing);
                        const y = chartHeight + padding - ((day.workSession.duration / maxDuration) * chartHeight);
                        return { x, y, duration: day.workSession.duration };
                      });
                      
                      // Create area path
                      const areaPath = points.reduce((path, point, i) => {
                        if (i === 0) {
                          return `M ${point.x} ${chartHeight + padding} L ${point.x} ${point.y}`;
                        }
                        return `${path} L ${point.x} ${point.y}`;
                      }, '') + ` L ${points[points.length - 1].x} ${chartHeight + padding} Z`;
                      
                      // Create line path
                      const linePath = points.reduce((path, point, i) => {
                        if (i === 0) {
                          return `M ${point.x} ${point.y}`;
                        }
                        return `${path} L ${point.x} ${point.y}`;
                      }, '');
                      
                      return (
                        <>
                          {/* Grid lines */}
                          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                            const y = chartHeight + padding - (ratio * chartHeight);
                            return (
                              <line
                                key={ratio}
                                x1={padding}
                                y1={y}
                                x2={chartWidth + padding}
                                y2={y}
                                stroke="#F3F4F6"
                                strokeWidth="1"
                              />
                            );
                          })}
                          
                          {/* Area fill */}
                          <path
                            d={areaPath}
                            fill="url(#gradient)"
                            opacity="0.3"
                          />
                          
                          {/* Line */}
                          <path
                            d={linePath}
                            fill="none"
                            stroke="hsl(45, 93%, 47%)"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          
                          {/* Points */}
                          {points.map((point, i) => {
                            const isToday = i === recentDays.length - 1;
                            return (
                              <g key={i}>
                                <circle
                                  cx={point.x}
                                  cy={point.y}
                                  r={isToday ? 5 : point.duration > 0 ? 4 : 3}
                                  fill={isToday ? 'hsl(45, 93%, 47%)' : point.duration > 0 ? 'hsl(45, 93%, 47%)' : '#E5E7EB'}
                                  stroke="white"
                                  strokeWidth="2"
                                />
                                {/* Day labels */}
                                <text
                                  x={point.x}
                                  y={chartHeight + padding + 15}
                                  textAnchor="middle"
                                  fontSize="8"
                                  fill="#9CA3AF"
                                  fontFamily="system-ui, -apple-system, sans-serif"
                                >
                                  {format(new Date(recentDays[i].date), 'EEE').slice(0, 1)}
                                </text>
                              </g>
                            );
                          })}
                          
                          {/* Gradient definition */}
                          <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="hsl(45, 93%, 47%)" stopOpacity="0.4" />
                              <stop offset="100%" stopColor="hsl(45, 93%, 47%)" stopOpacity="0.05" />
                            </linearGradient>
                          </defs>
                        </>
                      );
                    })()}
                  </svg>
                </div>
              </div>
              
              {/* Stats grid - Strava style */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="border-l-4 pl-3" style={{ borderColor: 'hsl(45, 93%, 47%)' }}>
                  <div className="flex items-center gap-1 mb-1">
                    <Flame className="h-3 w-3 text-gray-400" />
                    <span className="text-gray-500 text-[10px] uppercase tracking-wide font-semibold">Streak</span>
                  </div>
                  <p className="text-gray-900 text-2xl font-bold">{streak}</p>
                  <p className="text-gray-400 text-[10px] mt-0.5">days</p>
                </div>
                
                <div className="border-l-4 pl-3" style={{ borderColor: 'hsl(45, 93%, 47%)' }}>
                  <div className="flex items-center gap-1 mb-1">
                    <CheckCircle2 className="h-3 w-3 text-gray-400" />
                    <span className="text-gray-500 text-[10px] uppercase tracking-wide font-semibold">Tasks</span>
                  </div>
                  <p className="text-gray-900 text-2xl font-bold">
                    {completedTasks}
                  </p>
                  <p className="text-gray-400 text-[10px] mt-0.5">of {totalTasks}</p>
                </div>
                
                <div className="border-l-4 pl-3" style={{ borderColor: 'hsl(45, 93%, 47%)' }}>
                  <div className="flex items-center gap-1 mb-1">
                    <Calendar className="h-3 w-3 text-gray-400" />
                    <span className="text-gray-500 text-[10px] uppercase tracking-wide font-semibold">Week</span>
                  </div>
                  <p className="text-gray-900 text-2xl font-bold">
                    {formatDuration(totalWeekMinutes)}
                  </p>
                  <p className="text-gray-400 text-[10px] mt-0.5">total</p>
                </div>
              </div>
              
              {/* Footer */}
              <div className="mt-auto pt-4 border-t border-gray-200">
                <p className="text-gray-400 text-xs text-center">
                  focusapp.dev
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex gap-2">
          <Button
            onClick={downloadImage}
            disabled={isGenerating}
            className="flex-1 gap-2"
            variant="outline"
          >
            <Download className="h-4 w-4" />
            Download
          </Button>
          <Button
            onClick={shareImage}
            disabled={isGenerating}
            className="flex-1 gap-2"
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
