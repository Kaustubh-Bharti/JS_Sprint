import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../hooks/useTheme';
import { useProgress } from '../../hooks/useProgress';
import CodeEditor from './CodeEditor';
import OutputConsole from './OutputConsole';
import { Lesson } from '../../data/curriculum';
import { Play, RotateCcw, Lightbulb, CheckCircle, ChevronRight, ChevronLeft, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';

function runUserCode(code: string): { output: string[]; error: string | null } {
  const output: string[] = [];

  const sandboxLog = (...args: unknown[]) => {
    output.push(
      args
        .map(a => {
          if (typeof a === 'object' && a !== null) {
            try {
              return JSON.stringify(a);
            } catch {
              return String(a);
            }
          }
          return String(a);
        })
        .join(' ')
    );
  };

  try {
    const fn = new Function('console', code);
    fn({ log: sandboxLog, warn: sandboxLog, error: sandboxLog, info: sandboxLog });
    return { output, error: null };
  } catch (e) {
    return { output, error: e instanceof Error ? e.message : String(e) };
  }
}

function extractVariables(code: string): { name: string; value: string }[] {
  const vars: { name: string; value: string }[] = [];
  const pattern = /(?:let|const|var)\s+(\w+)\s*=\s*([^;,\n]+)/g;
  let m;
  while ((m = pattern.exec(code)) !== null) {
    vars.push({ name: m[1], value: m[2].trim() });
  }
  return vars.slice(0, 6);
}

function getKeyTakeaways(lesson: Lesson): string[] {
  const sentences = lesson.afterExplanation
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(Boolean);
  return [lesson.objective, ...sentences.slice(0, 2)];
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
  const [showHint, setShowHint] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const [leftPanelTab, setLeftPanelTab] = useState<'objective' | 'explanation'>('objective');
  const [justCompleted, setJustCompleted] = useState(false);

  const isCompleted = progress.completedLessons.includes(lesson.id);
  const variables = extractVariables(code);
  const keyTakeaways = getKeyTakeaways(lesson);

  useEffect(() => {
    setCode(lesson.starterCode);
    setOutput([]);
    setError(null);
    setRunning(false);
    setShowHint(false);
    setHasRun(false);
    setLeftPanelTab('objective');
    setJustCompleted(false);
  }, [lesson.id, lesson.starterCode]);

  const handleRun = useCallback(() => {
    setRunning(true);
    setShowHint(false);
    setTimeout(() => {
      const result = runUserCode(code);
      setOutput(result.output);
      setError(result.error);
      setRunning(false);
      setHasRun(true);
      setLeftPanelTab('explanation');

      if (!result.error) {
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
    setShowHint(false);
    setHasRun(false);
    setLeftPanelTab('objective');
  };

  const panelSurface = isDark
    ? 'bg-white/[0.04] border-white/10 backdrop-blur-md'
    : `${colors.card} border-white/60 backdrop-blur-sm`;

  const renderObjectiveContent = () => (
    <div className="space-y-4">
      <div>
        <span className={`text-[10px] font-bold uppercase tracking-wider ${colors.muted}`}>Objective</span>
        <p className={`text-sm font-medium mt-1.5 leading-relaxed ${colors.text}`}>{lesson.objective}</p>
      </div>

      <div className={`w-full h-px ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />

      <div>
        <span className={`text-[10px] font-bold uppercase tracking-wider ${colors.muted}`}>Concept</span>
        <p className={`text-sm leading-relaxed mt-1.5 ${colors.muted}`}>{lesson.explanation}</p>
      </div>

      <div className={`w-full h-px ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />

      <div className="flex items-center justify-between">
        <span className={`text-[10px] font-bold uppercase tracking-wider ${colors.muted}`}>XP Reward</span>
        <span
          className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
            isDark ? 'bg-yellow-900/30 text-yellow-300' : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
          }`}
        >
          +{lesson.xpReward} XP
        </span>
      </div>

      <button
        onClick={() => setShowHint(!showHint)}
        className={`flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl transition-all ${
          isDark
            ? 'bg-yellow-900/30 text-yellow-400 hover:bg-yellow-900/50 border border-yellow-700/30'
            : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border border-yellow-200'
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
            className={`text-xs font-mono p-3 rounded-xl ${
              isDark ? 'bg-yellow-900/20 text-yellow-300 border border-yellow-700/30' : 'bg-yellow-50 text-yellow-800 border border-yellow-200'
            }`}
          >
            {lesson.hint}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const renderExplanationContent = () => (
    <div className="space-y-4">
      <div>
        <span className={`text-[10px] font-bold uppercase tracking-wider ${colors.muted}`}>What happened?</span>
        <p className={`text-sm leading-relaxed mt-1.5 ${colors.text}`}>{lesson.afterExplanation}</p>
      </div>

      {variables.length > 0 && (
        <div>
          <span className={`text-[10px] font-bold uppercase tracking-wider ${colors.muted}`}>Variables in memory</span>
          <div className="flex flex-wrap gap-2 mt-2">
            {variables.map((v, i) => (
              <motion.div
                key={v.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.08 }}
                className={`flex flex-col rounded-xl overflow-hidden border ${colors.border} shadow-sm`}
              >
                <div className={`px-3 py-1 text-xs font-mono font-bold bg-gradient-to-r ${colors.accent} text-white`}>
                  {v.name}
                </div>
                <div
                  className={`px-3 py-2 text-xs font-mono ${
                    isDark ? 'bg-slate-800/80 text-green-400' : 'bg-gray-50 text-gray-800'
                  }`}
                >
                  {v.value.length > 24 ? v.value.slice(0, 24) + '…' : v.value}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <div>
        <span className={`text-[10px] font-bold uppercase tracking-wider ${colors.muted}`}>Learning breakdown</span>
        <p className={`text-sm leading-relaxed mt-1.5 ${colors.muted}`}>{lesson.explanation}</p>
      </div>

      <div>
        <span className={`text-[10px] font-bold uppercase tracking-wider ${colors.muted}`}>Key takeaways</span>
        <ul className="mt-2 space-y-1.5">
          {keyTakeaways.map((point, i) => (
            <li key={i} className={`flex items-start gap-2 text-sm ${colors.text}`}>
              <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 bg-gradient-to-r ${colors.accent}`} />
              <span className="leading-relaxed">{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen pt-20 pb-8 px-4 sm:px-6 ${colors.bg}`}>
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-5">
        <div className="flex items-center gap-2 mb-2">
          <button
            onClick={onBack}
            className={`text-sm ${colors.muted} hover:opacity-80 flex items-center gap-1 transition-colors`}
          >
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
          <div className={`text-sm ${colors.muted}`}>
            {lessonIndex + 1} / {totalLessons}
          </div>
        </div>

        <div className={`mt-2 h-1.5 rounded-full ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`}>
          <div
            className={`h-full rounded-full bg-gradient-to-r ${colors.accent} transition-all duration-300`}
            style={{ width: `${((lessonIndex + 1) / totalLessons) * 100}%` }}
          />
        </div>
      </div>

      {/* Main layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[280px_1fr_1fr] gap-4 items-start">
        {/* Left panel */}
        <div className={`rounded-2xl border shadow-sm p-4 h-fit ${panelSurface}`}>
          {!hasRun ? (
            <motion.div key="pre-run" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {renderObjectiveContent()}
            </motion.div>
          ) : (
            <motion.div key="post-run" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className={`flex gap-1.5 mb-4 pb-3 border-b ${colors.border}`}>
                {(['objective', 'explanation'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setLeftPanelTab(tab)}
                    className={`flex-1 px-3 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
                      leftPanelTab === tab
                        ? `bg-gradient-to-r ${colors.accent} text-white shadow-sm`
                        : `${colors.muted} ${isDark ? 'hover:bg-white/10' : 'hover:bg-white/80'}`
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {leftPanelTab === 'objective' ? (
                  <motion.div
                    key="objective-tab"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                  >
                    {renderObjectiveContent()}
                  </motion.div>
                ) : (
                  <motion.div
                    key="explanation-tab"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                  >
                    {renderExplanationContent()}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </div>

        {/* Center: Code Editor */}
        <div className="flex flex-col gap-3">
          <CodeEditor value={code} onChange={setCode} height="320px" />

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

          <div className="flex items-center justify-between mt-1">
            <button
              onClick={onPrev}
              disabled={isFirst}
              className={`flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                isFirst
                  ? 'opacity-30 cursor-not-allowed border-transparent'
                  : `${colors.border} ${colors.text} hover:scale-[1.02] ${isDark ? 'hover:bg-white/10' : 'hover:bg-white/80'}`
              }`}
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
        <div className="flex flex-col gap-3 self-start">
          <OutputConsole output={output} error={error} running={running} />

          <AnimatePresence>
            {justCompleted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="rounded-xl p-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md"
              >
                <div className="flex items-center gap-2 font-bold text-sm">
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
