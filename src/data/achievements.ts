export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  condition: (xp: number, completedLessons: string[], completedChallenges: string[], streak: number) => boolean;
}

export const badges: Badge[] = [
  { id: 'first-step', name: 'First Step', description: 'Complete your first lesson', icon: '👣', color: 'bg-blue-500', condition: (_, cl) => cl.length >= 1 },
  { id: 'streak-3', name: 'Hot Streak', description: 'Maintain a 3-day streak', icon: '🔥', color: 'bg-orange-500', condition: (_, _cl, _cc, s) => s >= 3 },
  { id: 'day1-complete', name: 'Variable Master', description: 'Complete Day 1', icon: '📦', color: 'bg-cyan-500', condition: (_, cl) => ['day1-lesson1','day1-lesson2','day1-lesson3','day1-lesson4'].every(l => cl.includes(l)) },
  { id: 'day2-complete', name: 'Logic Lord', description: 'Complete Day 2', icon: '🔀', color: 'bg-emerald-500', condition: (_, cl) => ['day2-lesson1','day2-lesson2','day2-lesson3'].every(l => cl.includes(l)) },
  { id: 'day3-complete', name: 'Function Ninja', description: 'Complete Day 3', icon: '⚡', color: 'bg-amber-500', condition: (_, cl) => ['day3-lesson1','day3-lesson2','day3-lesson3'].every(l => cl.includes(l)) },
  { id: 'xp-100', name: 'Century Club', description: 'Earn 100 XP', icon: '💯', color: 'bg-yellow-500', condition: (xp) => xp >= 100 },
  { id: 'xp-500', name: 'XP Legend', description: 'Earn 500 XP', icon: '🏆', color: 'bg-gold-500', condition: (xp) => xp >= 500 },
  { id: 'first-challenge', name: 'Arena Rookie', description: 'Complete your first challenge', icon: '⚔️', color: 'bg-rose-500', condition: (_, _cl, cc) => cc.length >= 1 },
  { id: 'five-challenges', name: 'Problem Solver', description: 'Complete 5 challenges', icon: '🧩', color: 'bg-violet-500', condition: (_, _cl, cc) => cc.length >= 5 },
  { id: 'sprint-complete', name: 'JS Sprinter', description: 'Complete all 5 days', icon: '🚀', color: 'bg-pink-500', condition: (_, cl) => cl.length >= 13 },
];
