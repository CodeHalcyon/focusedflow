export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'streak' | 'time' | 'tasks';
  requirement: number;
  unit: string;
}

export const achievements: Achievement[] = [
  // Streak achievements
  {
    id: 'streak_3',
    name: 'Getting Started',
    description: 'Work for 3 days in a row',
    icon: '🔥',
    category: 'streak',
    requirement: 3,
    unit: 'days',
  },
  {
    id: 'streak_7',
    name: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: '⚡',
    category: 'streak',
    requirement: 7,
    unit: 'days',
  },
  {
    id: 'streak_14',
    name: 'Two Week Champion',
    description: 'Maintain a 14-day streak',
    icon: '🏆',
    category: 'streak',
    requirement: 14,
    unit: 'days',
  },
  {
    id: 'streak_30',
    name: 'Monthly Master',
    description: 'Maintain a 30-day streak',
    icon: '👑',
    category: 'streak',
    requirement: 30,
    unit: 'days',
  },
  {
    id: 'streak_100',
    name: 'Century Legend',
    description: 'Maintain a 100-day streak',
    icon: '💎',
    category: 'streak',
    requirement: 100,
    unit: 'days',
  },
  // Time achievements (in hours)
  {
    id: 'time_10',
    name: 'First 10 Hours',
    description: 'Accumulate 10 hours of focus time',
    icon: '⏱️',
    category: 'time',
    requirement: 10,
    unit: 'hours',
  },
  {
    id: 'time_50',
    name: 'Half Century',
    description: 'Accumulate 50 hours of focus time',
    icon: '⌛',
    category: 'time',
    requirement: 50,
    unit: 'hours',
  },
  {
    id: 'time_100',
    name: 'Centurion',
    description: 'Accumulate 100 hours of focus time',
    icon: '🎯',
    category: 'time',
    requirement: 100,
    unit: 'hours',
  },
  {
    id: 'time_500',
    name: 'Time Lord',
    description: 'Accumulate 500 hours of focus time',
    icon: '🌟',
    category: 'time',
    requirement: 500,
    unit: 'hours',
  },
  {
    id: 'time_1000',
    name: 'Millennium',
    description: 'Accumulate 1000 hours of focus time',
    icon: '🚀',
    category: 'time',
    requirement: 1000,
    unit: 'hours',
  },
  // Task achievements
  {
    id: 'tasks_10',
    name: 'Task Starter',
    description: 'Complete 10 tasks',
    icon: '✅',
    category: 'tasks',
    requirement: 10,
    unit: 'tasks',
  },
  {
    id: 'tasks_50',
    name: 'Task Master',
    description: 'Complete 50 tasks',
    icon: '📋',
    category: 'tasks',
    requirement: 50,
    unit: 'tasks',
  },
  {
    id: 'tasks_100',
    name: 'Century Closer',
    description: 'Complete 100 tasks',
    icon: '🎖️',
    category: 'tasks',
    requirement: 100,
    unit: 'tasks',
  },
  {
    id: 'tasks_500',
    name: 'Task Titan',
    description: 'Complete 500 tasks',
    icon: '🏅',
    category: 'tasks',
    requirement: 500,
    unit: 'tasks',
  },
  {
    id: 'tasks_1000',
    name: 'Productivity Legend',
    description: 'Complete 1000 tasks',
    icon: '🎊',
    category: 'tasks',
    requirement: 1000,
    unit: 'tasks',
  },
];

export const getAchievementById = (id: string): Achievement | undefined => {
  return achievements.find((a) => a.id === id);
};
