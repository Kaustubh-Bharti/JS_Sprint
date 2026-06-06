import { motion } from 'framer-motion';
import { useTheme } from '../../hooks/useTheme';
import { useProgress } from '../../hooks/useProgress';
import { badges } from '../../data/achievements';
import { curriculum } from '../../data/curriculum';
import { challenges } from '../../data/problems';
import { Flame, Zap, Trophy, BookOpen, Target, Clock } from 'lucide-react';

export default function Dashboard() {
  const { colors, isDark } = useTheme();
  const { progress, xpProgress } = useProgress();

  const earnedBadges = badges.filter(b => progress.badges.includes(b.id));
  const lockedBadges = badges.filter(b => !progress.badges.includes(b.id));

  const totalLessons = curriculum.reduce((sum, d) => sum + d.lessons.length, 0);
  const totalChallenges = challenges.length;

  const stats = [
    { icon: <Zap size={20} className="text-yellow-500" />, label: 'Total XP', value: progress.xp, color: 'from-yellow-400 to-orange-500' },
    { icon: <Trophy size={20} className="text-amber-500" />, label: 'Level', value: progress.level, color: 'from-amber-400 to-yellow-500' },
    { icon: <Flame size={20} className="text-orange-500" />, label: 'Day Streak', value: progress.streak, color: 'from-orange-400 to-red-500' },
    { icon: <BookOpen size={20} className="text-blue-500" />, label: 'Lessons Done', value: `${progress.completedLessons.length}/${totalLessons}`, color: 'from-blue-400 to-cyan-500' },
    { icon: <Target size={20} className="text-rose-500" />, label: 'Challenges', value: `${progress.completedChallenges.length}/${totalChallenges}`, color: 'from-rose-400 to-pink-500' },
    { icon: <Clock size={20} className="text-violet-500" />, label: 'Badges Earned', value: `${earnedBadges.length}/${badges.length}`, color: 'from-violet-400 to-purple-500' },
  ];

  return (
    <div className={`min-h-screen pt-20 pb-12 px-4 relative overflow-hidden`}>
      {/* Animated gradient background orbs */}
      <motion.div
        className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #f59e0b, transparent)' }}
        animate={{ scale: [1, 1.1, 1], x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-1/3 right-1/3 w-80 h-80 rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #3b82f6, transparent)' }}
        animate={{ scale: [1, 1.15, 1], x: [0, -20, 0], y: [0, 25, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
      />

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className={`text-3xl font-extrabold ${colors.text}`}>Your Progress</h1>
          <p className={`text-base ${colors.muted} mt-1`}>Track your journey from beginner to JavaScript programmer.</p>
        </motion.div>

        {/* XP Level Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`rounded-2xl border ${colors.border} ${isDark ? 'bg-white/5' : 'bg-white/70'} p-6 mb-6`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg text-white font-extrabold text-xl`}>
                {progress.level}
              </div>
              <div>
                <p className={`font-bold text-lg ${colors.text}`}>Level {progress.level}</p>
                <p className={`text-sm ${colors.muted}`}>{progress.xp} XP total</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-sm ${colors.muted}`}>{100 - (progress.xp % 100)} XP to next level</p>
            </div>
          </div>
          <div className={`h-3 rounded-full ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${xpProgress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-orange-500"
            />
          </div>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className={`rounded-2xl border ${colors.border} ${isDark ? 'bg-white/5' : 'bg-white/70'} p-5`}
            >
              <div className="flex items-center gap-2 mb-2">
                {stat.icon}
                <span className={`text-xs font-medium uppercase tracking-wide ${colors.muted}`}>{stat.label}</span>
              </div>
              <p className={`text-3xl font-extrabold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                {stat.value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Day Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`rounded-2xl border ${colors.border} ${isDark ? 'bg-white/5' : 'bg-white/70'} p-6 mb-8`}
        >
          <h2 className={`text-lg font-bold mb-4 ${colors.text}`}>Day-by-Day Progress</h2>
          <div className="space-y-3">
            {curriculum.map(day => {
              const done = day.lessons.filter(l => progress.completedLessons.includes(l.id)).length;
              const pct = (done / day.lessons.length) * 100;
              return (
                <div key={day.id} className="flex items-center gap-3">
                  <span className="text-xl w-8">{day.icon}</span>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className={`text-sm font-medium ${colors.text}`}>Day {day.id}: {day.title}</span>
                      <span className={`text-xs ${colors.muted}`}>{done}/{day.lessons.length}</span>
                    </div>
                    <div className={`h-1.5 rounded-full ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`}>
                      <div className={`h-full rounded-full bg-gradient-to-r ${day.color} transition-all duration-700`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={`rounded-2xl border ${colors.border} ${isDark ? 'bg-white/5' : 'bg-white/70'} p-6`}
        >
          <h2 className={`text-lg font-bold mb-4 ${colors.text}`}>Badges</h2>

          {earnedBadges.length > 0 && (
            <div className="mb-4">
              <p className={`text-xs font-semibold uppercase tracking-wide mb-3 ${colors.muted}`}>Earned</p>
              <div className="flex flex-wrap gap-3">
                {earnedBadges.map(badge => (
                  <motion.div
                    key={badge.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`flex flex-col items-center gap-1 p-3 rounded-xl ${badge.color} shadow-lg min-w-[70px]`}
                  >
                    <span className="text-2xl">{badge.icon}</span>
                    <span className="text-xs font-bold text-white text-center leading-tight">{badge.name}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {lockedBadges.length > 0 && (
            <div>
              <p className={`text-xs font-semibold uppercase tracking-wide mb-3 ${colors.muted}`}>Locked</p>
              <div className="flex flex-wrap gap-3">
                {lockedBadges.map(badge => (
                  <div
                    key={badge.id}
                    className={`flex flex-col items-center gap-1 p-3 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-gray-100'} min-w-[70px] opacity-50`}
                    title={badge.description}
                  >
                    <span className="text-2xl grayscale">{badge.icon}</span>
                    <span className={`text-xs font-medium text-center leading-tight ${colors.muted}`}>{badge.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
