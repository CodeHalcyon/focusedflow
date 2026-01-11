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
        backgroundColor: null,
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
        backgroundColor: null,
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
        
        {/* The shareable card */}
        <div className="flex justify-center py-4">
          <div
            ref={cardRef}
            className="w-[320px] aspect-[9/16] rounded-3xl overflow-hidden relative"
            style={{
              background: 'linear-gradient(160deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)',
            }}
          >
            {/* Decorative elements */}
            <div 
              className="absolute top-0 right-0 w-48 h-48 opacity-20"
              style={{
                background: 'radial-gradient(circle, hsl(45, 93%, 47%) 0%, transparent 70%)',
              }}
            />
            <div 
              className="absolute bottom-20 left-0 w-32 h-32 opacity-10"
              style={{
                background: 'radial-gradient(circle, hsl(45, 93%, 47%) 0%, transparent 70%)',
              }}
            />
            
            {/* Content */}
            <div className="relative h-full flex flex-col p-6">
              {/* Header */}
              <div className="flex items-center gap-2 mb-2">
                <img src="/favicon.png" alt="Focus" className="h-8 w-8" />
                <span className="text-white font-bold text-xl">Focus</span>
              </div>
              <p className="text-white/50 text-sm mb-8">
                {format(new Date(), 'EEEE, MMMM d, yyyy')}
              </p>
              
              {/* Main stat */}
              <div className="flex-1 flex flex-col justify-center">
                <p className="text-white/60 text-sm uppercase tracking-wider mb-2">
                  Today's Focus Time
                </p>
                <p 
                  className="text-5xl font-bold mb-8"
                  style={{ color: 'hsl(45, 93%, 47%)' }}
                >
                  {formatDuration(todayData.workSession.duration)}
                </p>
                
                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Flame className="h-4 w-4" style={{ color: 'hsl(45, 93%, 47%)' }} />
                      <span className="text-white/60 text-xs">Streak</span>
                    </div>
                    <p className="text-white text-2xl font-bold">{streak} days</p>
                  </div>
                  
                  <div className="bg-white/5 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="h-4 w-4" style={{ color: 'hsl(45, 93%, 47%)' }} />
                      <span className="text-white/60 text-xs">Tasks</span>
                    </div>
                    <p className="text-white text-2xl font-bold">
                      {completedTasks}/{totalTasks}
                    </p>
                  </div>
                  
                  <div className="bg-white/5 rounded-2xl p-4 col-span-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4" style={{ color: 'hsl(45, 93%, 47%)' }} />
                      <span className="text-white/60 text-xs">This Week</span>
                    </div>
                    <p className="text-white text-2xl font-bold">
                      {formatDuration(totalWeekMinutes)}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Activity bars */}
              <div className="mt-6">
                <p className="text-white/40 text-xs mb-2">Last 7 days</p>
                <div className="flex gap-1 items-end h-12">
                  {recentDays.map((day, i) => {
                    const maxDuration = Math.max(
                      ...recentDays.map((d) => d.workSession.duration),
                      1
                    );
                    const height = (day.workSession.duration / maxDuration) * 100;
                    const isToday = i === recentDays.length - 1;
                    
                    return (
                      <div
                        key={day.date}
                        className="flex-1 rounded-t-sm transition-all"
                        style={{
                          height: `${Math.max(height, 8)}%`,
                          backgroundColor: isToday 
                            ? 'hsl(45, 93%, 47%)' 
                            : day.workSession.duration > 0 
                              ? 'hsl(45, 93%, 47%, 0.4)' 
                              : 'rgba(255,255,255,0.1)',
                        }}
                      />
                    );
                  })}
                </div>
              </div>
              
              {/* Footer */}
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-white/30 text-xs text-center">
                  Made with Focus • focusapp.dev
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
