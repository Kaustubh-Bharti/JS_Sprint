import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../hooks/useTheme';
import { useProgress } from '../../hooks/useProgress';
import CodeEditor from '../learning/CodeEditor';
import { challenges, Challenge } from '../../data/problems';
import { Play, RotateCcw, Lightbulb, CheckCircle, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
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
  isCollapsed: boolean;
  onCollapse: (value: boolean) => void;
}

function ChallengeList({ onSelect, selected, completedChallenges, isCollapsed, onCollapse }: ChallengeListProps) {
  const { colors, isDark } = useTheme();
  const [filter, setFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');

  const filtered = filter === 'all' ? challenges : challenges.filter(c => c.difficulty === filter);

  if (isCollapsed) {
    return (
      <motion.button
        onClick={() => onCollapse(false)}
        className={`fixed top-20 left-4 z-30 rounded-lg shadow-lg ${isDark ? 'bg-white/10 hover:bg-white/20 text-white border border-white/30' : 'bg-white shadow-2xl hover:shadow-xl border'} p-2.5 transition-all hover:scale-110`}
        title="Show challenge list"
      >
        <ChevronRight size={20} />
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={`absolute left-0 top-0 bottom-0 z-40 w-80 rounded-r-2xl border-r ${colors.border} flex flex-col overflow-hidden backdrop-blur-md ${isDark ? 'bg-black/40' : 'bg-white/60'}`}
    >
      <div className={`p-4 border-b ${colors.border} flex items-center justify-between`}>
        <span className={`text-sm font-semibold ${colors.text}`}>Challenges</span>
        <button
          onClick={() => onCollapse(true)}
          className={`p-1.5 rounded-lg hover:scale-110 transition-all ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-200'}`}
          title="Hide list"
        >
          <ChevronLeft size={16} />
        </button>
      </div>

      <div className={`p-3 border-b ${colors.border}`}>
        <div className="flex gap-1 flex-wrap">
          {(['all', 'easy', 'medium', 'hard'] as const).map(d => (
            <button
              key={d}
              onClick={() => setFilter(d)}
              className={`px-2 py-1 rounded-md text-xs font-medium capitalize transition-all ${filter === d ? `bg-gradient-to-r ${colors.accent} text-white` : `${colors.muted} ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}`}
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
            onClick={() => {
              onSelect(c);
              onCollapse(true);
            }}
            className={`w-full text-left p-4 border-b ${colors.border} transition-all ${
              selected?.id === c.id
                ? `${isDark ? 'bg-white/15' : 'bg-blue-50'}`
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
    </motion.div>
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [outputTab, setOutputTab] = useState<'question' | 'output' | 'tests'>('question');

  const selectChallenge = (c: Challenge) => {
    setSelected(c);
    setCode(c.starterCode);
    setOutput([]);
    setError(null);
    setTestResults([]);
    setShowHint(false);
    setHintIndex(0);
    setAllPassed(false);
    setOutputTab('question');
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
      setOutputTab('tests');
      if (passed && !progress.completedChallenges.includes(selected.id)) {
        completeChallenge(selected.id, selected.xpReward);
        confetti({ particleCount: 120, spread: 70, origin: { y: 0.5 } });
      }
    }, 300);
  }, [code, selected, progress, completeChallenge]);

  return (
    <div className={`min-h-screen pt-20 pb-8 relative overflow-hidden ${colors.bg}`}>
      {/* Challenge List Sidebar */}
      <ChallengeList
        onSelect={selectChallenge}
        selected={selected}
        completedChallenges={progress.completedChallenges}
        isCollapsed={sidebarCollapsed}
        onCollapse={setSidebarCollapsed}
      />

      {/* Main IDE Layout */}
      <div className={`h-[calc(100vh-80px)] flex overflow-hidden relative ${sidebarCollapsed ? '' : 'pl-80'}`}>
        {/* Left Column: Editor (65%) */}
        <div className="flex flex-col flex-[0_0_65%] overflow-hidden">
          {selected ? (
            <>
              {/* Editor */}
              <div className="flex-1 min-h-0 flex flex-col">
                <div className={`flex-1 min-h-0 ${isDark ? 'border-r border-white/10' : 'border-r border-gray-200'}`}>
                  <CodeEditor value={code} onChange={setCode} height="100%" />
                </div>

                {/* Hint Display */}
                <AnimatePresence>
                  {showHint && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className={`px-3 py-2 text-xs ${isDark ? 'bg-yellow-900/20 text-yellow-300 border-t border-yellow-700/30' : 'bg-yellow-50 text-yellow-800 border-t border-yellow-200'} font-mono`}
                    >
                      💡 {selected.hints[hintIndex % selected.hints.length]}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Action Buttons */}
                <div className={`flex items-center gap-2 p-2 border-t ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                  <button
                    onClick={handleRun}
                    disabled={running}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded text-xs font-bold border ${colors.border} ${colors.text} hover:bg-opacity-80 transition-all disabled:opacity-50`}
                  >
                    <Play size={12} /> Run
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={running}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded text-xs font-bold text-white bg-gradient-to-r ${colors.accent} hover:shadow-md transition-all disabled:opacity-50`}
                  >
                    Submit
                  </button>
                  <button
                    onClick={() => { setCode(selected.starterCode); setOutput([]); setError(null); setTestResults([]); setAllPassed(false); }}
                    className={`flex items-center justify-center gap-1 px-3 py-2 rounded text-xs font-medium ${colors.muted} border ${colors.border} hover:bg-opacity-80 transition-all`}
                    title="Reset to starter code"
                  >
                    <RotateCcw size={12} />
                  </button>
                  <button
                    onClick={() => { setShowHint(!showHint); if (!showHint && hintIndex < selected.hints.length - 1) setHintIndex(prev => prev + 1); }}
                    className={`flex items-center justify-center gap-1 px-3 py-2 rounded text-xs font-medium ${isDark ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-700/30' : 'bg-yellow-50 text-yellow-700 border border-yellow-200'} hover:bg-opacity-80 transition-all`}
                    title="Show hint"
                  >
                    <Lightbulb size={12} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className={`flex items-center justify-center h-full ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
              <p className={`text-sm ${colors.muted}`}>Select a challenge to start coding</p>
            </div>
          )}
        </div>

        {/* Right Column: Question/Output Tabs (35%) */}
        <div className="flex-[0_0_35%] flex flex-col overflow-hidden">
          {selected ? (
            <>
              {/* Tab Headers */}
              <div className={`flex border-b ${colors.border}`}>
                <button
                  onClick={() => setOutputTab('question')}
                  className={`flex-1 px-3 py-2.5 text-xs font-semibold transition-all ${
                    outputTab === 'question'
                      ? `${colors.text} border-b-2 ${isDark ? 'border-white/50' : 'border-gray-900'}`
                      : `${colors.muted}`
                  }`}
                >
                  Question
                </button>
                <button
                  onClick={() => setOutputTab('output')}
                  className={`flex-1 px-3 py-2.5 text-xs font-semibold transition-all ${
                    outputTab === 'output'
                      ? `${colors.text} border-b-2 ${isDark ? 'border-white/50' : 'border-gray-900'}`
                      : `${colors.muted}`
                  }`}
                >
                  Output
                </button>
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-auto">
                {/* Question Tab */}
                {outputTab === 'question' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`p-3 space-y-3 text-xs ${isDark ? 'bg-white/5' : 'bg-white/50'}`}
                  >
                    {/* Title */}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded border font-bold capitalize ${isDark ? DIFF_COLORS_DARK[selected.difficulty] : DIFF_COLORS[selected.difficulty]}`}>
                          {selected.difficulty}
                        </span>
                        {progress.completedChallenges.includes(selected.id) && (
                          <span className="flex items-center gap-0.5 text-green-600 dark:text-green-400">
                            <CheckCircle size={12} /> Solved
                          </span>
                        )}
                      </div>
                      <h2 className={`text-sm font-bold mb-0.5 ${colors.text}`}>{selected.title}</h2>
                      <p className={`text-xs font-semibold uppercase tracking-wide ${colors.muted}`}>Day {selected.day}</p>
                    </div>

                    {/* Scenario */}
                    <div>
                      <p className={`text-xs font-bold uppercase tracking-wide ${colors.muted} mb-1`}>Scenario</p>
                      <p className={`italic px-2 py-1.5 rounded ${isDark ? 'bg-amber-900/20 border border-amber-700/30 text-amber-200' : 'bg-amber-50 border border-amber-200 text-amber-900'} text-xs`}>
                        {selected.scenario}
                      </p>
                    </div>

                    {/* Problem */}
                    <div>
                      <p className={`text-xs font-bold uppercase tracking-wide ${colors.muted} mb-1`}>Problem</p>
                      <p className={`leading-relaxed ${colors.text} text-xs`}>{selected.description}</p>
                    </div>

                    {/* Tags */}
                    <div>
                      <p className={`text-xs font-bold uppercase tracking-wide ${colors.muted} mb-1`}>Tags</p>
                      <div className="flex flex-wrap gap-1">
                        {selected.tags.map(tag => (
                          <span key={tag} className={`text-xs px-2 py-0.5 rounded ${isDark ? 'bg-white/10 text-slate-300' : 'bg-gray-100 text-gray-700'}`}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Reward */}
                    <div>
                      <p className={`text-xs font-bold uppercase tracking-wide ${colors.muted} mb-1`}>Reward</p>
                      <div className={`text-xs font-bold px-2 py-1 rounded inline-flex items-center gap-1 ${isDark ? 'bg-yellow-900/30 text-yellow-300' : 'bg-yellow-50 text-yellow-700 border border-yellow-200'}`}>
                        +{selected.xpReward} XP
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Output Tab */}
                {outputTab === 'output' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`h-full flex flex-col ${isDark ? 'bg-white/5' : 'bg-white/50'}`}
                  >
                    {/* Output Content */}
                    <div className="flex-1 overflow-auto">
                      {/* Console Output */}
                      {(output.length > 0 || error) && (
                        <div className="p-2 text-xs font-mono space-y-1 border-b border-current border-opacity-20">
                          {error && (
                            <div className="text-red-500">
                              ❌ {error}
                            </div>
                          )}
                          {output.map((line, i) => (
                            <div key={i} className={`whitespace-pre-wrap break-words ${colors.text}`}>
                              {line}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Test Results */}
                      {testResults.length > 0 && (
                        <div className="p-2 text-xs space-y-1">
                          {allPassed && (
                            <div className="rounded bg-gradient-to-r from-green-500 to-emerald-500 text-white p-2 font-bold text-center mb-1">
                              ✅ All tests passed! +{selected?.xpReward} XP
                            </div>
                          )}
                          {testResults.map((r, i) => (
                            <div key={i} className={`flex items-start gap-2 p-1.5 rounded border text-xs ${r.passed ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                              <span className="flex-shrink-0">{r.passed ? '✅' : '❌'}</span>
                              <div className="flex-1 min-w-0">
                                {r.hidden ? (
                                  <span className={colors.muted}>Hidden test {r.passed ? 'passed' : 'failed'}</span>
                                ) : (
                                  <div className="space-y-0.5">
                                    <div className={colors.text}>Expected: <code className={`font-mono text-xs ${r.passed ? 'text-green-400' : 'text-yellow-400'}`}>{r.expected}</code></div>
                                    {!r.passed && <div className={colors.text}>Got: <code className="font-mono text-xs text-red-400">{r.got || 'nothing'}</code></div>}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Empty State */}
                      {output.length === 0 && !error && testResults.length === 0 && (
                        <div className={`flex items-center justify-center h-full ${colors.muted}`}>
                          <p className="text-xs">Click "Run" to see output</p>
                        </div>
                      )}
                    </div>

                    {/* Clear Console Button */}
                    {(output.length > 0 || error) && (
                      <div className={`border-t ${colors.border} p-1.5`}>
                        <button
                          onClick={() => { setOutput([]); setError(null); }}
                          className={`w-full flex items-center justify-center gap-1.5 px-2 py-1.5 rounded text-xs font-medium ${colors.muted} border ${colors.border} hover:bg-opacity-80 transition-all`}
                        >
                          <Trash2 size={11} /> Clear
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </>
          ) : (
            <div className={`flex items-center justify-center h-full ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
              <p className={`text-sm ${colors.muted}`}>Select a challenge</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
