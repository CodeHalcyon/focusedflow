-- Add foreign key constraints with ON DELETE CASCADE for user data cleanup
ALTER TABLE public.user_goals
ADD CONSTRAINT user_goals_user_id_fkey
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.user_achievements
ADD CONSTRAINT user_achievements_user_id_fkey
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.sticky_notes
ADD CONSTRAINT sticky_notes_user_id_fkey
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;