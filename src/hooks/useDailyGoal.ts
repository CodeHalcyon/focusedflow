import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const DEFAULT_GOAL_MINUTES = 60;

export function useDailyGoal() {
  const { user } = useAuth();
  const [goalMinutes, setGoalMinutes] = useState(DEFAULT_GOAL_MINUTES);
  const [loading, setLoading] = useState(true);

  // Fetch user's goal
  useEffect(() => {
    if (!user) {
      setGoalMinutes(DEFAULT_GOAL_MINUTES);
      setLoading(false);
      return;
    }

    const fetchGoal = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('user_goals')
        .select('daily_focus_minutes')
        .eq('user_id', user.id)
        .maybeSingle();

      if (data) {
        setGoalMinutes(data.daily_focus_minutes);
      }
      setLoading(false);
    };

    fetchGoal();
  }, [user]);

  const updateGoal = useCallback(
    async (minutes: number) => {
      if (!user) return;

      // Check if goal exists
      const { data: existing } = await supabase
        .from('user_goals')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (existing) {
        // Update existing
        await supabase
          .from('user_goals')
          .update({ daily_focus_minutes: minutes })
          .eq('user_id', user.id);
      } else {
        // Insert new
        await supabase.from('user_goals').insert({
          user_id: user.id,
          daily_focus_minutes: minutes,
        });
      }

      setGoalMinutes(minutes);
    },
    [user]
  );

  const getProgress = useCallback(
    (currentMinutes: number): number => {
      if (goalMinutes === 0) return 100;
      return Math.min((currentMinutes / goalMinutes) * 100, 100);
    },
    [goalMinutes]
  );

  return {
    goalMinutes,
    loading,
    updateGoal,
    getProgress,
  };
}
