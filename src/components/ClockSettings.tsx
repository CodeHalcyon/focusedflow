import { Settings, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import type { ClockSettings as ClockSettingsType } from '@/types';
import { cn } from '@/lib/utils';

interface ClockSettingsProps {
  settings: ClockSettingsType;
  onSettingsChange: (settings: ClockSettingsType) => void;
}

const themes: { value: ClockSettingsType['theme']; label: string }[] = [
  { value: 'minimal', label: 'Minimal' },
  { value: 'bold', label: 'Bold' },
  { value: 'neon', label: 'Neon' },
  { value: 'retro', label: 'Retro' },
  { value: 'glass', label: 'Glass' },
];

const sizes: { value: ClockSettingsType['size']; label: string }[] = [
  { value: 'small', label: 'S' },
  { value: 'medium', label: 'M' },
  { value: 'large', label: 'L' },
  { value: 'xlarge', label: 'XL' },
];

const fontWeights: { value: ClockSettingsType['fontWeight']; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'normal', label: 'Normal' },
  { value: 'medium', label: 'Medium' },
  { value: 'semibold', label: 'Semi' },
  { value: 'bold', label: 'Bold' },
];

export function ClockSettingsPanel({ settings, onSettingsChange }: ClockSettingsProps) {
  const updateSetting = <K extends keyof ClockSettingsType>(
    key: K,
    value: ClockSettingsType[K]
  ) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 glass" align="end">
        <div className="space-y-4">
          <h4 className="font-medium text-sm">Clock Settings</h4>
          
          {/* Theme */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Theme</Label>
            <div className="flex flex-wrap gap-1.5">
              {themes.map(theme => (
                <button
                  key={theme.value}
                  onClick={() => updateSetting('theme', theme.value)}
                  className={cn(
                    'px-2.5 py-1 rounded-md text-xs transition-all',
                    settings.theme === theme.value
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:text-foreground'
                  )}
                >
                  {theme.label}
                </button>
              ))}
            </div>
          </div>

          {/* Size */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Size</Label>
            <div className="flex gap-1.5">
              {sizes.map(size => (
                <button
                  key={size.value}
                  onClick={() => updateSetting('size', size.value)}
                  className={cn(
                    'px-3 py-1 rounded-md text-xs transition-all flex-1',
                    settings.size === size.value
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:text-foreground'
                  )}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </div>

          {/* Font Weight */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Weight</Label>
            <div className="flex flex-wrap gap-1.5">
              {fontWeights.map(weight => (
                <button
                  key={weight.value}
                  onClick={() => updateSetting('fontWeight', weight.value)}
                  className={cn(
                    'px-2 py-1 rounded-md text-xs transition-all',
                    settings.fontWeight === weight.value
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:text-foreground'
                  )}
                >
                  {weight.label}
                </button>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-3 pt-2 border-t border-border">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Show Seconds</Label>
              <Switch
                checked={settings.showSeconds}
                onCheckedChange={(checked) => updateSetting('showSeconds', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-xs">24-Hour Format</Label>
              <Switch
                checked={settings.use24Hour}
                onCheckedChange={(checked) => updateSetting('use24Hour', checked)}
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
