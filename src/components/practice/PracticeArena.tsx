import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../hooks/useTheme';
import { useProgress } from '../../hooks/useProgress';
import CodeEditor from '../learning/CodeEditor';
import OutputConsole from '../learning/OutputConsole';
import { challenges, Challenge } from '../../data/problems';
import { Play, RotateCcw, Lightbulb, CheckCircle, Filter } from 'lucide-react';
import confetti from 'canvas-confetti';

function runTestCase(code: string, testInput: string): string {
  try {
    const fullCode = code + `\ntry { let __result = ${testInput}; console.log(String(__result)); } catch(e) { console.log("ERROR: " + e.message); }`;
    const output: string[] = [];
    const fn = new Function('console', fullCode);
    fn({ log: (...args: unknown[]) => output.push(args.map(String).join(' ')), warn: () => {}, error: () => {}, info: () => {} });
    return output.join('\n').trim();
  } catch (e) {
    return 'ERROR: ' + (e instanceof Error ? e.message : String(e));
  }
}

function runUserCode(code: string): { output: string[]; error: string | null } {
  const output: string[] = [];
  try {
    const fn = new Function('console', code);
    fn({ log: (...args: unknown[]) => output.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')), warn: (...args: unknown[]) => output.push(args.map(String).join(' ')), error: (...args: unknown[]) => output.push(args.map(String).join(' ')), info: (...args: unknown[]) => output.push(args.map(String).join(' ')) });
    return { output, error: null };
  } catch (e) {
    return { output, error: e instanceof Error ? e.message : String(e) };
  }
}

const DIFF_COLORS: Record<string, string> = {
  easy: 'bg-green-100 text-green-700 border-green-200',
  medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  hard: 'bg-red-100 text-red-700 border-red-200',
};

const DIFF_COLORS_DARK: Record<string, string> = {
  easy: 'bg-green-900/40 text-green-400 border-green-800',
  medium: 'bg-yellow-900/40 text-yellow-400 border-yellow-800',
  hard: 'bg-red-900/40 text-red-400 border-red-800',
};

interface ChallengeListProps {
  onSelect: (c: Challenge) => void;
  selected: Challenge | null;
  completedChallenges: string[];
}

function ChallengeList({ onSelect, selected, completedChallenges }: ChallengeListProps) {
  const { colors, isDark } = useTheme();
  const [filter, setFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');

  const filtered = filter === 'all' ? challenges : challenges.filter(c => c.difficulty === filter);

  return (
    <div className={`flex flex-col h-full rounded-2xl border ${colors.border} overflow-hidden`}>
      <div className={`p-4 border-b ${colors.border} ${isDark ? 'bg-white/5' : 'bg-white/80'}`}>
        <div className="flex items-center gap-2 mb-3">
          <Filter size={14} className={colors.muted} />
          <span className={`text-sm font-semibold ${colors.text}`}>Challenges</span>
        </div>
        <div className="flex gap-1">
          {(['all', 'easy', 'medium', 'hard'] as const).map(d => (
            <button
              key={d}
              onClick={() => setFilter(d)}
              className={`px-2 py-0.5 rounded-md text-xs font-medium capitalize transition-all ${filter === d ? `bg-gradient-to-r ${colors.accent} text-white` : `${colors.muted} ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filtered.map(c => (
          <button
            key={c.id}
            onClick={() => onSelect(c)}
            className={`w-full text-left p-4 border-b ${colors.border} transition-all ${
              selected?.id === c.id
                ? `${isDark ? 'bg-white/10' : 'bg-blue-50'}`
                : `${isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className={`text-sm font-medium ${colors.text} flex items-center gap-1.5`}>
                {completedChallenges.includes(c.id) && <CheckCircle size={12} className="text-green-500" />}
                {c.title}
              </span>
              <span className={`text-xs px-1.5 py-0.5 rounded border ${isDark ? DIFF_COLORS_DARK[c.difficulty] : DIFF_COLORS[c.difficulty]} capitalize`}>
                {c.difficulty}
              </span>
            </div>
            <div className="flex gap-1 flex-wrap">
              {c.tags.slice(0, 2).map(tag => (
                <span key={tag} className={`text-xs px-1.5 py-0.5 rounded ${isDark ? 'bg-white/10 text-slate-400' : 'bg-gray-100 text-gray-500'}`}>{tag}</span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function PracticeArena() {
  const { colors, isDark } = useTheme();
  const { progress, completeChallenge } = useProgress();
  const [selected, setSelected] = useState<Challenge | null>(challenges[0]);
  const [code, setCode] = useState(challenges[0].starterCode);
  const [output, setOutput] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [testResults, setTestResults] = useState<{ passed: boolean; expected: string; got: string; hidden?: boolean }[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const [allPassed, setAllPassed] = useState(false);

  const selectChallenge = (c: Challenge) => {
    setSelected(c);
    setCode(c.starterCode);
    setOutput([]);
    setError(null);
    setTestResults([]);
    setShowHint(false);
    setHintIndex(0);
    setAllPassed(false);
  };

  const handleRun = useCallback(() => {
    if (!selected) return;
    setRunning(true);
    setTimeout(() => {
      const { output: out, error: err } = runUserCode(code);
      setOutput(out);
      setError(err);
      setRunning(false);
    }, 200);
  }, [code, selected]);

  const handleSubmit = useCallback(() => {
    if (!selected) return;
    setRunning(true);
    setTimeout(() => {
      const results = selected.testCases.map(tc => {
        const got = runTestCase(code, tc.input);
        return { passed: got.trim() === tc.expected.trim(), expected: tc.expected, got, hidden: tc.hidden };
      });
      setTestResults(results);
      setRunning(false);
      const passed = results.every(r => r.passed);
      setAllPassed(passed);
      if (passed && !progress.completedChallenges.includes(selected.id)) {
        completeChallenge(selected.id, selected.xpReward);
        confetti({ particleCount: 120, spread: 70, origin: { y: 0.5 } });
      }
    }, 300);
  }, [code, selected, progress, completeChallenge]);

  return (
    <div className="min-h-screen pt-20 pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className={`text-3xl font-extrabold ${colors.text}`}>Practice Arena</h1>
          <p className={`text-base ${colors.muted} mt-1`}>Real-world scenarios. Auto-graded. Get better by doing.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr_340px] gap-4 h-[calc(100vh-160px)]">

          {/* Challenge list */}
          <ChallengeList
            onSelect={selectChallenge}
            selected={selected}
            completedChallenges={progress.completedChallenges}
          />

          {/* Problem + Editor */}
          <div className="flex flex-col gap-3 overflow-hidden">
            {selected && (
              <>
                {/* Problem statement */}
                <div className={`rounded-2xl border ${colors.border} ${isDark ? 'bg-white/5' : 'bg-white/70'} p-5 flex-shrink-0`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs px-2 py-0.5 rounded border capitalize ${isDark ? DIFF_COLORS_DARK[selected.difficulty] : DIFF_COLORS[selected.difficulty]}`}>
                      {selected.difficulty}
                    </span>
                    {progress.completedChallenges.includes(selected.id) && (
                      <span className="flex items-center gap-1 text-xs font-bold text-green-600">
                        <CheckCircle size={12} /> Solved
                      </span>
                    )}
                  </div>
                  <h2 className={`text-lg font-bold mb-2 ${colors.text}`}>{selected.title}</h2>
                  <p className={`text-sm italic mb-3 ${colors.muted} bg-amber-50/50 dark:bg-amber-900/10 px-3 py-2 rounded-lg border-l-2 border-amber-400`}>
                    Scenario: {selected.scenario}
                  </p>
                  <p className={`text-sm leading-relaxed ${colors.muted}`}>{selected.description}</p>
                </div>

                {/* Editor */}
                <div className="flex-1 min-h-0">
                  <CodeEditor value={code} onChange={setCode} height="260px" />
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={handleRun}
                    disabled={running}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border ${colors.border} ${colors.text} transition-all hover:scale-105`}
                  >
                    <Play size={14} /> Run
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={running}
                    className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold text-white bg-gradient-to-r ${colors.accent} hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50`}
                  >
                    Submit & Grade
                  </button>
                  <button
                    onClick={() => { setCode(selected.starterCode); setOutput([]); setError(null); setTestResults([]); setAllPassed(false); }}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm ${colors.muted} border ${colors.border} hover:scale-105 transition-all`}
                  >
                    <RotateCcw size={13} />
                  </button>
                  <button
                    onClick={() => { setShowHint(!showHint); if (!showHint && hintIndex < selected.hints.length - 1) setHintIndex(prev => prev + 1); }}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm ${isDark ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-50 text-yellow-700'} border border-yellow-200/50 hover:scale-105 transition-all`}
                  >
                    <Lightbulb size={13} /> Hint
                  </button>
                </div>

                <AnimatePresence>
                  {showHint && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className={`text-sm px-4 py-3 rounded-xl ${isDark ? 'bg-yellow-900/20 text-yellow-300' : 'bg-yellow-50 text-yellow-800'} font-mono`}
                    >
                      💡 {selected.hints[hintIndex % selected.hints.length]}
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
          </div>

          {/* Output + Test Results */}
          <div className="flex flex-col gap-3 overflow-hidden">
            <OutputConsole output={output} error={error} running={running} />

            {/* Test results */}
            {testResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-2xl border ${colors.border} ${isDark ? 'bg-white/5' : 'bg-white/70'} overflow-hidden`}
              >
                <div className={`px-4 py-2 border-b ${colors.border} flex items-center justify-between`}>
                  <span className={`text-sm font-semibold ${colors.text}`}>Test Results</span>
                  {allPassed && <span className="text-xs font-bold text-green-500">All Passed!</span>}
                </div>
                <div className="p-3 space-y-2">
                  {testResults.map((r, i) => (
                    <div key={i} className={`flex items-center gap-2 text-xs p-2 rounded-lg ${r.passed ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
                      <span>{r.passed ? '✅' : '❌'}</span>
                      {r.hidden ? (
                        <span className={colors.muted}>Hidden test case — {r.passed ? 'passed' : 'failed'}</span>
                      ) : (
                        <span className={colors.muted}>Expected: <span className="font-mono text-green-400">{r.expected}</span>{!r.passed && <> · Got: <span className="font-mono text-red-400">{r.got || 'nothing'}</span></>}</span>
                      )}
                    </div>
                  ))}
                </div>
                {allPassed && (
                  <div className="px-4 pb-3">
                    <div className="rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white p-3 text-sm font-bold text-center">
                      +{selected?.xpReward} XP Earned!
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
