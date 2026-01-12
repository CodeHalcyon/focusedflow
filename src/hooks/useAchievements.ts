import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { achievements, Achievement, getAchievementById } from '@/data/achievements';
import { useToast } from '@/hooks/use-toast';

interface UnlockedAchievement {
  achievementId: string;
  unlockedAt: string;
}

export function useAchievements() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [unlockedIds, setUnlockedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  // Fetch unlocked achievements
  useEffect(() => {
    if (!user) {
      setUnlockedIds(new Set());
      setLoading(false);
      return;
    }

    const fetchUnlocked = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('user_achievements')
        .select('achievement_id, unlocked_at')
        .eq('user_id', user.id);

      if (data) {
        setUnlockedIds(new Set(data.map((a) => a.achievement_id)));
      }
      setLoading(false);
    };

    fetchUnlocked();
  }, [user]);

  // Check and unlock achievements based on stats
  const checkAndUnlock = useCallback(
    async (stats: { streak: number; totalHours: number; completedTasks: number }) => {
      if (!user) return;

      const newlyUnlocked: Achievement[] = [];

      for (const achievement of achievements) {
        if (unlockedIds.has(achievement.id)) continue;

        let qualified = false;

        switch (achievement.category) {
          case 'streak':
            qualified = stats.streak >= achievement.requirement;
            break;
          case 'time':
            qualified = stats.totalHours >= achievement.requirement;
            break;
          case 'tasks':
            qualified = stats.completedTasks >= achievement.requirement;
            break;
        }

        if (qualified) {
          // Insert into database
          const { error } = await supabase.from('user_achievements').insert({
            user_id: user.id,
            achievement_id: achievement.id,
          });

          if (!error) {
            newlyUnlocked.push(achievement);
            setUnlockedIds((prev) => new Set([...prev, achievement.id]));
          }
        }
      }

      // Show toast for newly unlocked achievements
      if (newlyUnlocked.length > 0) {
        for (const achievement of newlyUnlocked) {
          toast({
            title: `🎉 Achievement Unlocked!`,
            description: `${achievement.icon} ${achievement.name} - ${achievement.description}`,
          });
        }
      }

      return newlyUnlocked;
    },
    [user, unlockedIds, toast]
  );

  const getUnlockedAchievements = useCallback((): Achievement[] => {
    return achievements.filter((a) => unlockedIds.has(a.id));
  }, [unlockedIds]);

  const getLockedAchievements = useCallback((): Achievement[] => {
    return achievements.filter((a) => !unlockedIds.has(a.id));
  }, [unlockedIds]);

  const getProgress = useCallback(
    (
      achievement: Achievement,
      stats: { streak: number; totalHours: number; completedTasks: number }
    ): number => {
      let current = 0;
      switch (achievement.category) {
        case 'streak':
          current = stats.streak;
          break;
        case 'time':
          current = stats.totalHours;
          break;
        case 'tasks':
          current = stats.completedTasks;
          break;
      }
      return Math.min((current / achievement.requirement) * 100, 100);
    },
    []
  );

  return {
    achievements,
    unlockedIds,
    loading,
    checkAndUnlock,
    getUnlockedAchievements,
    getLockedAchievements,
    getProgress,
  };
}
