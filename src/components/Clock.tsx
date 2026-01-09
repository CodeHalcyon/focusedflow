import { useState, useEffect } from 'react';
import { formatClockTime, getAmPm } from '@/lib/dateUtils';
import type { ClockSettings } from '@/types';
import { cn } from '@/lib/utils';

interface ClockProps {
  settings: ClockSettings;
}

const themeStyles: Record<ClockSettings['theme'], string> = {
  minimal: 'text-foreground',
  bold: 'text-primary font-bold tracking-tight',
  neon: 'text-primary glow-primary',
  retro: 'text-secondary tracking-widest',
  glass: 'text-foreground/90 backdrop-blur-sm',
};

const sizeStyles: Record<ClockSettings['size'], string> = {
  small: 'text-4xl md:text-5xl',
  medium: 'text-5xl md:text-7xl',
  large: 'text-6xl md:text-8xl',
  xlarge: 'text-7xl md:text-9xl',
};

const fontWeightStyles: Record<ClockSettings['fontWeight'], string> = {
  light: 'font-light',
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

export function Clock({ settings }: ClockProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const timeString = formatClockTime(time, settings.use24Hour, settings.showSeconds);
  const amPm = !settings.use24Hour ? getAmPm(time) : null;

  return (
    <div className="flex flex-col items-center gap-2 animate-fade-in">
      <div className="flex items-baseline gap-3">
        <span
          className={cn(
            'font-mono transition-all duration-500',
            themeStyles[settings.theme],
            sizeStyles[settings.size],
            fontWeightStyles[settings.fontWeight]
          )}
        >
          {timeString}
        </span>
        {amPm && (
          <span className={cn(
            'font-mono text-muted-foreground transition-all duration-500',
            settings.size === 'xlarge' ? 'text-3xl' :
            settings.size === 'large' ? 'text-2xl' :
            settings.size === 'medium' ? 'text-xl' : 'text-lg'
          )}>
            {amPm}
          </span>
        )}
      </div>
    </div>
  );
}
