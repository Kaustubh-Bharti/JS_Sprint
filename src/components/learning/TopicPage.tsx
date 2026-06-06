import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../hooks/useTheme';
import { useProgress } from '../../hooks/useProgress';
import CodeEditor from './CodeEditor';
import OutputConsole from './OutputConsole';
import VisualExplainer from './VisualExplainer';
import { Lesson } from '../../data/curriculum';
import { Play, RotateCcw, Lightbulb, CheckCircle, ChevronRight, ChevronLeft, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';

function runUserCode(code: string): { output: string[]; error: string | null } {
  const output: string[] = [];

  const sandboxLog = (...args: unknown[]) => {
    output.push(args.map(a => {
      if (typeof a === 'object' && a !== null) {
        try { return JSON.stringify(a); } catch { return String(a); }
      }
      return String(a);
    }).join(' '));
  };

  try {
    const fn = new Function('console', code);
    fn({ log: sandboxLog, warn: sandboxLog, error: sandboxLog, info: sandboxLog });
    return { output, error: null };
  } catch (e) {
    return { output, error: e instanceof Error ? e.message : String(e) };
  }
}

interface TopicPageProps {
  lesson: Lesson;
  lessonIndex: number;
  totalLessons: number;
  dayTitle: string;
  onPrev: () => void;
  onNext: () => void;
  onBack: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export default function TopicPage({
  lesson,
  lessonIndex,
  totalLessons,
  dayTitle,
  onPrev,
  onNext,
  onBack,
  isFirst,
  isLast,
}: TopicPageProps) {
  const { colors, isDark } = useTheme();
  const { progress, completeLesson } = useProgress();
  const [code, setCode] = useState(lesson.starterCode);
  const [output, setOutput] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);

  const isCompleted = progress.completedLessons.includes(lesson.id);

  const handleRun = useCallback(() => {
    setRunning(true);
    setShowHint(false);
    setTimeout(() => {
      const result = runUserCode(code);
      setOutput(result.output);
      setError(result.error);
      setRunning(false);
      setHasRun(true);

      if (!result.error) {
        setShowExplanation(true);
        const outputStr = result.output.join('\n');
        if (outputStr.includes(lesson.expectedOutput) && !isCompleted) {
          completeLesson(lesson.id, lesson.xpReward);
          setJustCompleted(true);
          confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
          setTimeout(() => setJustCompleted(false), 3000);
        }
      }
    }, 300);
  }, [code, lesson, isCompleted, completeLesson]);

  const handleReset = () => {
    setCode(lesson.starterCode);
    setOutput([]);
    setError(null);
    setShowExplanation(false);
    setShowHint(false);
    setHasRun(false);
  };

  return (
    <div className={`min-h-screen pt-20 pb-8 px-4 ${isDark ? '' : ''}`}>
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-4">
        <div className="flex items-center gap-2 mb-2">
          <button onClick={onBack} className={`text-sm ${colors.muted} hover:${colors.text} flex items-center gap-1 transition-colors`}>
            ← {dayTitle}
          </button>
          <span className={colors.muted}>/</span>
          <span className={`text-sm ${colors.text} font-medium`}>{lesson.title}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className={`text-xl font-bold ${colors.text}`}>{lesson.title}</h1>
            {isCompleted && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">
                <CheckCircle size={12} /> Done
              </span>
            )}
          </div>
          <div className={`text-sm ${colors.muted}`}>{lessonIndex + 1} / {totalLessons}</div>
        </div>

        {/* Progress bar */}
        <div className={`mt-2 h-1 rounded-full ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`}>
          <div
            className={`h-full rounded-full bg-gradient-to-r ${colors.accent} transition-all`}
            style={{ width: `${((lessonIndex + 1) / totalLessons) * 100}%` }}
          />
        </div>
      </div>

      {/* Main layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[280px_1fr_1fr] gap-4">

        {/* Left panel: Explanation */}
        <div className={`rounded-2xl border ${colors.border} ${isDark ? 'bg-white/5' : 'bg-white/70'} backdrop-blur-sm p-5 h-fit`}>
          <div className="mb-3">
            <span className={`text-xs font-semibold uppercase tracking-wide ${colors.muted}`}>Objective</span>
            <p className={`text-sm font-medium mt-1 ${colors.text}`}>{lesson.objective}</p>
          </div>

          <div className={`w-full h-px ${isDark ? 'bg-white/10' : 'bg-gray-200'} my-3`} />

          <div className="mb-3">
            <span className={`text-xs font-semibold uppercase tracking-wide ${colors.muted}`}>Concept</span>
            <p className={`text-sm leading-relaxed mt-1 ${colors.muted}`}>{lesson.explanation}</p>
          </div>

          <div className={`w-full h-px ${isDark ? 'bg-white/10' : 'bg-gray-200'} my-3`} />

          <div className="flex items-center justify-between text-xs mb-2">
            <span className={`font-semibold uppercase tracking-wide ${colors.muted}`}>XP Reward</span>
            <span className="font-bold text-yellow-500">+{lesson.xpReward} XP</span>
          </div>

          {/* Hint */}
          <button
            onClick={() => setShowHint(!showHint)}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg mt-2 transition-all ${
              isDark ? 'bg-yellow-900/30 text-yellow-400 hover:bg-yellow-900/50' : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
            }`}
          >
            <Lightbulb size={12} />
            {showHint ? 'Hide Hint' : 'Show Hint'}
          </button>

          <AnimatePresence>
            {showHint && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`mt-2 text-xs font-mono p-2 rounded-lg ${isDark ? 'bg-yellow-900/20 text-yellow-300' : 'bg-yellow-50 text-yellow-800'}`}
              >
                {lesson.hint}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Center: Code Editor */}
        <div className="flex flex-col gap-3">
          <CodeEditor value={code} onChange={setCode} height="320px" />

          {/* Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleRun}
              disabled={running}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r ${colors.accent} hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100`}
            >
              <Play size={14} />
              {running ? 'Running...' : 'Run Code'}
            </button>
            <button
              onClick={handleReset}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm border ${colors.border} ${colors.muted} hover:scale-105 transition-all`}
            >
              <RotateCcw size={14} />
              Reset
            </button>
          </div>

          {/* Visual Explainer */}
          <VisualExplainer
            explanation={lesson.afterExplanation}
            show={showExplanation && hasRun}
            code={code}
          />

          {/* Nav buttons */}
          <div className="flex items-center justify-between mt-2">
            <button
              onClick={onPrev}
              disabled={isFirst}
              className={`flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium transition-all ${isFirst ? 'opacity-30 cursor-not-allowed' : `${colors.muted} hover:${colors.text}`}`}
            >
              <ChevronLeft size={16} /> Previous
            </button>
            <button
              onClick={onNext}
              className={`flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-bold text-white bg-gradient-to-r ${colors.accent} hover:shadow-md hover:scale-105 transition-all`}
            >
              {isLast ? 'Complete Day' : 'Next'} <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Right: Output Console */}
        <div className="flex flex-col gap-3">
          <OutputConsole output={output} error={error} running={running} />

          {/* Completion banner */}
          <AnimatePresence>
            {justCompleted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="rounded-xl p-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white"
              >
                <div className="flex items-center gap-2 font-bold">
                  <Trophy size={18} />
                  Lesson Complete! +{lesson.xpReward} XP earned!
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
