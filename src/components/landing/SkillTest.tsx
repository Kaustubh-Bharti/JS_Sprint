import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../hooks/useTheme';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

const QUESTIONS = [
  {
    q: 'What does `console.log("hi")` do?',
    options: ['Shows an alert box', 'Prints "hi" to the console', 'Creates a variable', 'Opens a file'],
    answer: 1,
  },
  {
    q: 'Which keyword creates a variable?',
    options: ['var', 'let', 'const', 'All of the above'],
    answer: 3,
  },
  {
    q: 'What does `===` check?',
    options: ['Assignment', 'Loose equality', 'Strict equality (value + type)', 'Greater than'],
    answer: 2,
  },
  {
    q: 'What is a function?',
    options: ['A type of data', 'A reusable block of code', 'A loop', 'An array method'],
    answer: 1,
  },
  {
    q: 'How do you access the first element of `arr`?',
    options: ['arr[1]', 'arr.first()', 'arr[0]', 'arr.get(0)'],
    answer: 2,
  },
  {
    q: 'What does `arr.push(item)` do?',
    options: ['Removes the last item', 'Adds item to the beginning', 'Adds item to the end', 'Sorts the array'],
    answer: 2,
  },
];

const SCORE_MESSAGES: Record<string, { title: string; message: string; icon: string }> = {
  '0-2': { title: 'Perfect Starting Point!', message: 'You\'re exactly who JS Sprint is for. Start from Day 1 and build your skills from scratch.', icon: '🌱' },
  '3-4': { title: 'Some Basics Known!', message: 'You know a bit! You might find Day 1-2 quick. But Day 3 onwards is where things get interesting.', icon: '📚' },
  '5-6': { title: 'Already Got the Basics!', message: 'Impressive! Jump straight to Day 3 — Functions & Arrays. The challenges will sharpen your skills.', icon: '⚡' },
};

interface SkillTestProps {
  onClose: () => void;
  onStart: (startDay: number) => void;
}

export default function SkillTest({ onClose, onStart }: SkillTestProps) {
  const { colors, isDark } = useTheme();
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [done, setDone] = useState(false);

  const score = answers.filter(Boolean).length;

  const handleSelect = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    const correct = i === QUESTIONS[currentQ].answer;

    setTimeout(() => {
      const newAnswers = [...answers, correct];
      setAnswers(newAnswers);
      if (currentQ + 1 < QUESTIONS.length) {
        setCurrentQ(currentQ + 1);
        setSelected(null);
      } else {
        setDone(true);
      }
    }, 600);
  };

  const getResult = () => {
    if (score <= 2) return SCORE_MESSAGES['0-2'];
    if (score <= 4) return SCORE_MESSAGES['3-4'];
    return SCORE_MESSAGES['5-6'];
  };

  const getRecommendedDay = () => {
    if (score <= 2) return 1;
    if (score <= 4) return 2;
    return 3;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`relative max-w-lg w-full rounded-3xl border ${colors.border} ${isDark ? 'bg-slate-900' : 'bg-white'} shadow-2xl overflow-hidden`}
      >
        {!done ? (
          <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Clock size={16} className={colors.muted} />
                <span className={`text-sm font-medium ${colors.muted}`}>Question {currentQ + 1} of {QUESTIONS.length}</span>
              </div>
              <div className={`flex gap-1`}>
                {QUESTIONS.map((_, i) => (
                  <div key={i} className={`w-2 h-2 rounded-full ${i < answers.length ? (answers[i] ? 'bg-green-500' : 'bg-red-500') : i === currentQ ? `bg-gradient-to-r ${colors.accent.replace('from-', '').replace('to-', '')}` : isDark ? 'bg-slate-700' : 'bg-gray-200'}`} />
                ))}
              </div>
            </div>

            {/* Question */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQ}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className={`text-xl font-bold mb-6 ${colors.text}`}>{QUESTIONS[currentQ].q}</h2>
                <div className="space-y-2">
                  {QUESTIONS[currentQ].options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelect(i)}
                      className={`w-full text-left px-4 py-3 rounded-xl border transition-all text-sm font-medium ${
                        selected === null
                          ? `${colors.border} ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-50'} ${colors.text}`
                          : selected === i
                            ? i === QUESTIONS[currentQ].answer
                              ? 'border-green-500 bg-green-50 text-green-700'
                              : 'border-red-500 bg-red-50 text-red-700'
                            : i === QUESTIONS[currentQ].answer
                              ? 'border-green-500 bg-green-50/30 text-green-600'
                              : `${colors.border} opacity-40 ${colors.muted}`
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        {opt}
                        {selected !== null && i === QUESTIONS[currentQ].answer && <CheckCircle size={16} className="text-green-500" />}
                        {selected === i && i !== QUESTIONS[currentQ].answer && <XCircle size={16} className="text-red-500" />}
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="text-5xl mb-4">{getResult().icon}</div>
            <h2 className={`text-2xl font-extrabold mb-2 ${colors.text}`}>{getResult().title}</h2>
            <p className={`text-sm ${colors.muted} mb-4 leading-relaxed`}>{getResult().message}</p>

            <div className={`rounded-xl p-4 mb-6 ${isDark ? 'bg-white/5' : 'bg-gray-50'} border ${colors.border}`}>
              <p className={`text-3xl font-extrabold bg-gradient-to-r ${colors.accent} bg-clip-text text-transparent`}>{score}/{QUESTIONS.length}</p>
              <p className={`text-sm ${colors.muted}`}>correct answers</p>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => onStart(getRecommendedDay())}
                className={`w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r ${colors.accent} hover:shadow-lg hover:scale-105 transition-all`}
              >
                Start from Day {getRecommendedDay()} (Recommended)
              </button>
              <button
                onClick={() => onStart(1)}
                className={`w-full py-2.5 rounded-xl font-medium border ${colors.border} ${colors.muted} hover:scale-105 transition-all text-sm`}
              >
                Start from Day 1 anyway
              </button>
              <button onClick={onClose} className={`text-sm ${colors.muted} mt-1 hover:${colors.text} transition-colors`}>
                Close
              </button>
            </div>
          </div>
        )}

        {/* Close button */}
        {!done && (
          <button onClick={onClose} className={`absolute top-4 right-4 text-sm ${colors.muted} hover:${colors.text} transition-colors`}>
            ✕
          </button>
        )}
      </motion.div>
    </div>
  );
}
