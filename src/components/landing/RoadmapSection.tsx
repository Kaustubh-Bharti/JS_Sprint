import { motion } from 'framer-motion';
import { useTheme } from '../../hooks/useTheme';
import { useProgress } from '../../hooks/useProgress';
import { curriculum } from '../../data/curriculum';
import { CheckCircle, Lock, ChevronRight } from 'lucide-react';

interface RoadmapProps {
  onDaySelect: (day: number) => void;
}

export default function RoadmapSection({ onDaySelect }: RoadmapProps) {
  const { colors, isDark } = useTheme();
  const { progress } = useProgress();

  const getDayProgress = (day: typeof curriculum[0]) => {
    const total = day.lessons.length;
    const done = day.lessons.filter(l => progress.completedLessons.includes(l.id)).length;
    return { done, total, pct: total > 0 ? (done / total) * 100 : 0 };
  };

  const isDayUnlocked = (dayIndex: number) => {
    if (dayIndex === 0) return true;
    const prevDay = curriculum[dayIndex - 1];
    const { done, total } = getDayProgress(prevDay);
    return done >= Math.ceil(total * 0.5);
  };

  return (
    <section className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className={`text-4xl font-extrabold mb-3 ${colors.text}`}>Your 5-Day Roadmap</h2>
          <p className={`text-lg ${colors.muted}`}>Complete each day to unlock the next. Game-like progression, real knowledge.</p>
        </motion.div>

        <div className="space-y-4">
          {curriculum.map((day, index) => {
            const { done, total, pct } = getDayProgress(day);
            const unlocked = isDayUnlocked(index);
            const isComplete = done === total;

            return (
              <motion.div
                key={day.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <button
                  onClick={() => unlocked && onDaySelect(day.id)}
                  disabled={!unlocked}
                  className={`w-full text-left rounded-2xl border transition-all duration-200 overflow-hidden ${
                    unlocked
                      ? `${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-white/70 hover:bg-white/90'} ${colors.border} hover:shadow-lg hover:scale-[1.01] cursor-pointer`
                      : `${isDark ? 'bg-white/5 opacity-50' : 'bg-gray-100/80 opacity-60'} cursor-not-allowed`
                  }`}
                >
                  <div className="flex items-center gap-4 p-5">
                    {/* Day number / icon */}
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${
                      isComplete ? 'bg-green-500 text-white' : unlocked ? `bg-gradient-to-br ${day.color} text-white` : 'bg-gray-300 text-gray-400'
                    } shadow-lg`}>
                      {isComplete ? <CheckCircle size={24} className="text-white" /> : unlocked ? day.icon : <Lock size={20} />}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`text-xs font-semibold uppercase tracking-wider ${colors.muted}`}>Day {day.id}</span>
                        {isComplete && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">Complete!</span>
                        )}
                        {!unlocked && (
                          <span className={`text-xs ${colors.muted}`}>Complete previous day to unlock</span>
                        )}
                      </div>
                      <h3 className={`text-lg font-bold ${colors.text}`}>{day.title}</h3>
                      <p className={`text-sm ${colors.muted}`}>{day.subtitle}</p>

                      {/* Progress bar */}
                      <div className="mt-3 flex items-center gap-2">
                        <div className={`flex-1 h-1.5 rounded-full ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`}>
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${day.color} transition-all duration-500`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className={`text-xs font-medium ${colors.muted}`}>{done}/{total}</span>
                      </div>
                    </div>

                    {/* Arrow */}
                    {unlocked && (
                      <ChevronRight size={20} className={colors.muted} />
                    )}
                  </div>
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
