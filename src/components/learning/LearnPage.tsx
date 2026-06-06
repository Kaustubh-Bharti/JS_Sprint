import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../hooks/useTheme';
import { useProgress } from '../../hooks/useProgress';
import { curriculum } from '../../data/curriculum';
import TopicPage from '../learning/TopicPage';
import { CheckCircle, Lock, ChevronRight } from 'lucide-react';

interface LearnPageProps {
  startDay?: number;
}

export default function LearnPage({ startDay }: LearnPageProps) {
  const { colors, isDark } = useTheme();
  const { progress } = useProgress();
  const [selectedDay, setSelectedDay] = useState<number | null>(startDay ?? null);
  const [selectedLessonIndex, setSelectedLessonIndex] = useState(0);

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

  if (selectedDay !== null) {
    const day = curriculum.find(d => d.id === selectedDay)!;
    const lesson = day.lessons[selectedLessonIndex];

    return (
      <TopicPage
        lesson={lesson}
        lessonIndex={selectedLessonIndex}
        totalLessons={day.lessons.length}
        dayTitle={`Day ${day.id}: ${day.title}`}
        onBack={() => setSelectedDay(null)}
        onPrev={() => setSelectedLessonIndex(prev => Math.max(0, prev - 1))}
        onNext={() => {
          if (selectedLessonIndex < day.lessons.length - 1) {
            setSelectedLessonIndex(prev => prev + 1);
          } else {
            setSelectedDay(null);
          }
        }}
        isFirst={selectedLessonIndex === 0}
        isLast={selectedLessonIndex === day.lessons.length - 1}
      />
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className={`text-3xl font-extrabold ${colors.text}`}>Learning Path</h1>
          <p className={`text-base ${colors.muted} mt-1`}>5 days. Real skills. Game-like progression.</p>
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
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.08 }}
              >
                <button
                  onClick={() => unlocked && setSelectedDay(day.id)}
                  disabled={!unlocked}
                  className={`w-full text-left rounded-2xl border transition-all duration-200 overflow-hidden ${
                    unlocked
                      ? `${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-white/70 hover:bg-white/90'} ${colors.border} hover:shadow-lg hover:scale-[1.01] cursor-pointer`
                      : `${isDark ? 'bg-white/5 opacity-50' : 'bg-gray-100/80 opacity-60'} cursor-not-allowed`
                  }`}
                >
                  <div className={`h-1 bg-gradient-to-r ${day.color} transition-all`} style={{ width: `${pct}%` }} />
                  <div className="flex items-center gap-4 p-5">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${
                      isComplete ? 'bg-green-500' : unlocked ? `bg-gradient-to-br ${day.color}` : 'bg-gray-300'
                    } shadow-md text-white`}>
                      {isComplete ? <CheckCircle size={24} /> : !unlocked ? <Lock size={20} /> : day.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`text-xs font-semibold uppercase tracking-wider ${colors.muted}`}>Day {day.id}</span>
                        {isComplete && <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">Complete!</span>}
                      </div>
                      <h3 className={`text-lg font-bold ${colors.text}`}>{day.title}</h3>
                      <p className={`text-sm ${colors.muted} mb-2`}>{day.subtitle}</p>

                      <div className="flex items-center gap-2">
                        {day.lessons.map(lesson => (
                          <div
                            key={lesson.id}
                            className={`w-2.5 h-2.5 rounded-full ${progress.completedLessons.includes(lesson.id) ? 'bg-green-500' : isDark ? 'bg-slate-600' : 'bg-gray-300'}`}
                            title={lesson.title}
                          />
                        ))}
                        <span className={`text-xs ${colors.muted} ml-1`}>{done}/{total} lessons</span>
                      </div>
                    </div>

                    {unlocked && <ChevronRight size={20} className={colors.muted} />}
                  </div>
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
