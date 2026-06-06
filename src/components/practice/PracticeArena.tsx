import { useState, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../hooks/useTheme';
import { useProgress } from '../../hooks/useProgress';
import { challenges, Challenge } from '../../data/problems';
import {
  Play,
  RotateCcw,
  Lightbulb,
  CheckCircle,
  ChevronRight,
  PanelLeftClose,
  Trash2,
  Terminal,
  AlertTriangle,
  Code2,
} from 'lucide-react';
import confetti from 'canvas-confetti';

function formatConsoleArgs(args: unknown[]): string {
  return args
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
    .join(' ');
}

function runTestCase(code: string, testInput: string): string {
  try {
    const fullCode =
      code +
      `\ntry { let __result = ${testInput}; console.log(String(__result)); } catch(e) { console.log("ERROR: " + e.message); }`;
    const output: string[] = [];
    const fn = new Function('console', fullCode);
    fn({
      log: (...args: unknown[]) => output.push(args.map(String).join(' ')),
      warn: () => {},
      error: () => {},
      info: () => {},
    });
    return output.join('\n').trim();
  } catch (e) {
    return 'ERROR: ' + (e instanceof Error ? e.message : String(e));
  }
}

function runUserCode(code: string): { logs: string[]; errors: string[]; runtimeError: string | null } {
  const logs: string[] = [];
  const errors: string[] = [];
  try {
    const fn = new Function('console', code);
    fn({
      log: (...args: unknown[]) => logs.push(formatConsoleArgs(args)),
      warn: (...args: unknown[]) => logs.push(formatConsoleArgs(args)),
      info: (...args: unknown[]) => logs.push(formatConsoleArgs(args)),
      error: (...args: unknown[]) => errors.push(formatConsoleArgs(args)),
    });
    return { logs, errors, runtimeError: null };
  } catch (e) {
    return { logs, errors, runtimeError: e instanceof Error ? e.message : String(e) };
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

function BackgroundOrbs({ isDark }: { isDark: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute -top-24 left-1/4 w-80 h-80 rounded-full blur-3xl"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(99,102,241,0.18), transparent)'
            : 'radial-gradient(circle, rgba(245,158,11,0.22), transparent)',
        }}
        animate={{ scale: [1, 1.15, 1], x: [0, 20, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full blur-3xl"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(139,92,246,0.14), transparent)'
            : 'radial-gradient(circle, rgba(59,130,246,0.18), transparent)',
        }}
        animate={{ scale: [1, 1.2, 1], x: [0, -15, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
      />
    </div>
  );
}

interface PracticeEditorProps {
  value: string;
  onChange: (value: string) => void;
}

function PracticeEditor({ value, onChange }: PracticeEditorProps) {
  return (
    <div className="h-full min-h-0 flex flex-col rounded-xl overflow-hidden bg-[#1e1e1e] border border-gray-700/50 shadow-inner">
      <div className="shrink-0 flex items-center gap-2 px-4 py-2 bg-[#252526] border-b border-[#333]">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
        </div>
        <span className="ml-1 text-[11px] text-gray-500 font-mono">script.js</span>
      </div>
      <div className="flex-1 min-h-0">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          value={value}
          onChange={val => onChange(val || '')}
          theme="vs-dark"
          options={{
            fontSize: 15,
            fontFamily: '"Fira Code", "Cascadia Code", monospace',
            fontLigatures: true,
            minimap: { enabled: false },
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            padding: { top: 12, bottom: 12 },
            suggestOnTriggerCharacters: true,
            quickSuggestions: true,
            tabSize: 2,
            automaticLayout: true,
          }}
        />
      </div>
    </div>
  );
}

interface ChallengeListProps {
  onSelect: (c: Challenge) => void;
  selected: Challenge | null;
  completedChallenges: string[];
  onCollapse: () => void;
}

function ChallengeToggle({ onOpen }: { onOpen: () => void }) {
  const { isDark } = useTheme();

  return (
    <button
      onClick={onOpen}
      className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold shadow-sm transition-all hover:scale-[1.02] ${
        isDark
          ? 'bg-white/10 hover:bg-white/15 text-white border border-white/15'
          : 'bg-white/90 hover:bg-white text-gray-800 border border-white/60'
      }`}
      title="Show challenges"
    >
      <ChevronRight size={14} />
      Challenges
    </button>
  );
}

function ChallengeList({ onSelect, selected, completedChallenges, onCollapse }: ChallengeListProps) {
  const { colors, isDark } = useTheme();
  const [filter, setFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');

  const filtered = filter === 'all' ? challenges : challenges.filter(c => c.difficulty === filter);

  return (
    <motion.aside
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      className={`absolute left-0 top-0 bottom-0 z-40 w-64 flex flex-col rounded-l-2xl border-r ${colors.border} shadow-2xl backdrop-blur-md ${
        isDark ? 'bg-slate-900/90' : 'bg-white/95'
      }`}
    >
      <div className={`shrink-0 px-4 py-3 border-b ${colors.border} flex items-center justify-between gap-2`}>
        <span className={`text-sm font-bold ${colors.text}`}>Challenges</span>
        <button
          onClick={onCollapse}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            isDark
              ? 'bg-white/10 hover:bg-white/15 text-white border border-white/15'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-200'
          }`}
          title="Close challenge list"
        >
          <PanelLeftClose size={14} />
          Close
        </button>
      </div>

      <div className={`shrink-0 px-4 py-3 border-b ${colors.border}`}>
        <div className="flex gap-1 flex-wrap">
          {(['all', 'easy', 'medium', 'hard'] as const).map(d => (
            <button
              key={d}
              onClick={() => setFilter(d)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-all ${
                filter === d
                  ? `bg-gradient-to-r ${colors.accent} text-white shadow-sm`
                  : `${colors.muted} ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        {filtered.map(c => (
          <button
            key={c.id}
            onClick={() => {
              onSelect(c);
              onCollapse();
            }}
            className={`w-full text-left px-4 py-3 border-b ${colors.border} transition-colors ${
              selected?.id === c.id
                ? isDark
                  ? 'bg-white/10'
                  : 'bg-blue-50/80'
                : isDark
                  ? 'hover:bg-white/5'
                  : 'hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className={`text-xs font-semibold ${colors.text} flex items-center gap-1 truncate`}>
                {completedChallenges.includes(c.id) && <CheckCircle size={11} className="text-green-500 shrink-0" />}
                {c.title}
              </span>
              <span
                className={`shrink-0 text-[10px] px-1.5 py-0.5 rounded-md border capitalize ${
                  isDark ? DIFF_COLORS_DARK[c.difficulty] : DIFF_COLORS[c.difficulty]
                }`}
              >
                {c.difficulty}
              </span>
            </div>
            <div className="flex gap-1 flex-wrap">
              {c.tags.slice(0, 2).map(tag => (
                <span
                  key={tag}
                  className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                    isDark ? 'bg-white/10 text-slate-400' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </motion.aside>
  );
}

export default function PracticeArena() {
  const { colors, isDark } = useTheme();
  const { progress, completeChallenge } = useProgress();
  const [selected, setSelected] = useState<Challenge | null>(challenges[0]);
  const [code, setCode] = useState(challenges[0].starterCode);
  const [logs, setLogs] = useState<string[]>([]);
  const [stderr, setStderr] = useState<string[]>([]);
  const [runtimeError, setRuntimeError] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [testResults, setTestResults] = useState<
    { passed: boolean; expected: string; got: string; hidden?: boolean }[]
  >([]);
  const [showHint, setShowHint] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const [allPassed, setAllPassed] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [activeTab, setActiveTab] = useState<'question' | 'output'>('question');

  const workspaceSurface = isDark
    ? 'bg-white/[0.04] border-white/10 backdrop-blur-md'
    : `${colors.card} border-white/60 backdrop-blur-sm`;
  const panelSurface = isDark
    ? 'bg-white/[0.03] border-white/10'
    : 'bg-white/60 border-white/50';

  const clearConsole = () => {
    setLogs([]);
    setStderr([]);
    setRuntimeError(null);
  };

  const selectChallenge = (c: Challenge) => {
    setSelected(c);
    setCode(c.starterCode);
    clearConsole();
    setTestResults([]);
    setShowHint(false);
    setHintIndex(0);
    setAllPassed(false);
    setActiveTab('question');
  };

  const handleRun = useCallback(() => {
    if (!selected) return;
    setRunning(true);
    setActiveTab('output');
    setTimeout(() => {
      const result = runUserCode(code);
      setLogs(result.logs);
      setStderr(result.errors);
      setRuntimeError(result.runtimeError);
      setRunning(false);
    }, 150);
  }, [code, selected]);

  const handleSubmit = useCallback(() => {
    if (!selected) return;
    setRunning(true);
    setActiveTab('output');
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
    }, 200);
  }, [code, selected, progress, completeChallenge]);

  const handleReset = () => {
    if (!selected) return;
    setCode(selected.starterCode);
    clearConsole();
    setTestResults([]);
    setAllPassed(false);
    setShowHint(false);
  };

  const hasConsoleOutput = logs.length > 0 || stderr.length > 0 || runtimeError !== null;

  return (
    <div className={`min-h-screen pt-20 pb-8 px-4 sm:px-6 relative overflow-hidden ${colors.bg}`}>
      <BackgroundOrbs isDark={isDark} />

      <div className="relative z-10 max-w-6xl mx-auto w-full sm:w-[92%] lg:w-[88%]">
        {/* Page intro */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-5 sm:mb-6"
        >
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border mb-3 ${colors.badgeBg} ${colors.badgeText} ${colors.badgeBorder}`}
          >
            <Code2 size={12} />
            Practice Arena
          </span>
          <h1 className={`text-2xl sm:text-3xl font-extrabold ${colors.text}`}>
            Learn by{' '}
            <span className={`bg-gradient-to-r ${colors.accent} bg-clip-text text-transparent`}>doing</span>
          </h1>
          <p className={`text-sm mt-1.5 ${colors.muted}`}>Write code, run it, pass the tests — earn XP along the way.</p>
        </motion.div>

        {/* Floating workspace card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08 }}
          className={`relative rounded-2xl border shadow-xl overflow-hidden ${workspaceSurface}`}
        >
          {/* Workspace toolbar */}
          <div
            className={`flex items-center justify-between gap-3 px-4 sm:px-5 py-3 border-b ${colors.border} ${
              isDark ? 'bg-white/[0.02]' : 'bg-white/40'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              {sidebarCollapsed && <ChallengeToggle onOpen={() => setSidebarCollapsed(false)} />}
              {selected && (
                <div className="min-w-0 hidden sm:block">
                  <p className={`text-sm font-bold truncate ${colors.text}`}>{selected.title}</p>
                  <p className={`text-[11px] capitalize ${colors.muted}`}>{selected.difficulty} challenge</p>
                </div>
              )}
            </div>
            {selected && (
              <span
                className={`shrink-0 text-xs font-bold px-2.5 py-1 rounded-lg ${
                  isDark ? 'bg-yellow-900/30 text-yellow-300' : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                }`}
              >
                +{selected.xpReward} XP
              </span>
            )}
          </div>

          {/* Workspace body */}
          <div
            className={`relative transition-[padding] duration-200 ease-out ${
              sidebarCollapsed ? 'pl-0' : 'pl-64'
            }`}
          >
            {!sidebarCollapsed && (
              <ChallengeList
                onSelect={selectChallenge}
                selected={selected}
                completedChallenges={progress.completedChallenges}
                onCollapse={() => setSidebarCollapsed(true)}
              />
            )}

            {selected ? (
              <div className="flex flex-col lg:flex-row gap-4 p-4 sm:p-5 min-h-[calc(100vh-16rem)] max-h-[calc(100vh-16rem)]">
                {/* Editor column (65%) */}
                <div className="flex flex-col w-full lg:w-[65%] min-w-0 min-h-0 gap-3">
                  <div className="flex-1 min-h-[280px] lg:min-h-0">
                    <PracticeEditor value={code} onChange={setCode} />
                  </div>

                  <AnimatePresence>
                    {showHint && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className={`rounded-xl px-4 py-2.5 text-xs font-mono ${
                          isDark
                            ? 'bg-yellow-900/20 text-yellow-300 border border-yellow-700/30'
                            : 'bg-yellow-50 text-yellow-800 border border-yellow-200'
                        }`}
                      >
                        <span className="font-semibold">Hint: </span>
                        {selected.hints[hintIndex % selected.hints.length]}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div
                    className={`shrink-0 flex flex-wrap items-center gap-2 p-2.5 rounded-xl border ${
                      isDark ? 'bg-white/[0.03] border-white/10' : 'bg-white/50 border-white/60'
                    }`}
                  >
                    <button
                      onClick={handleRun}
                      disabled={running}
                      className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-all disabled:opacity-50 hover:scale-[1.02] ${
                        isDark
                          ? 'border-white/15 text-white hover:bg-white/10'
                          : 'border-gray-200 text-gray-800 hover:bg-white shadow-sm'
                      }`}
                    >
                      <Play size={13} />
                      Run
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={running}
                      className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r ${colors.accent} shadow-md hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50`}
                    >
                      Submit
                    </button>
                    <button
                      onClick={handleReset}
                      className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium border transition-all hover:scale-[1.02] ${
                        isDark
                          ? 'border-white/15 text-gray-300 hover:bg-white/10'
                          : 'border-gray-200 text-gray-600 hover:bg-white shadow-sm'
                      }`}
                    >
                      <RotateCcw size={13} />
                      Reset
                    </button>
                    <button
                      onClick={() => {
                        setShowHint(!showHint);
                        if (!showHint && hintIndex < selected.hints.length - 1) {
                          setHintIndex(prev => prev + 1);
                        }
                      }}
                      className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium border transition-all hover:scale-[1.02] ${
                        isDark
                          ? 'bg-yellow-900/25 text-yellow-400 border-yellow-700/30 hover:bg-yellow-900/40'
                          : 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100'
                      }`}
                    >
                      <Lightbulb size={13} />
                      Hint
                    </button>
                    {running && (
                      <span className={`ml-auto text-[11px] ${colors.muted} animate-pulse`}>Running…</span>
                    )}
                  </div>
                </div>

                {/* Question / Output panel (35%) */}
                <div className="flex flex-col w-full lg:w-[35%] min-w-0 min-h-[240px] lg:min-h-0">
                  <div
                    className={`flex flex-col flex-1 min-h-0 rounded-2xl border shadow-sm overflow-hidden ${panelSurface}`}
                  >
                    {/* Tab pills */}
                    <div className={`shrink-0 flex gap-1.5 p-2.5 border-b ${colors.border}`}>
                      {(['question', 'output'] as const).map(tab => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={`flex-1 px-3 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
                            activeTab === tab
                              ? `bg-gradient-to-r ${colors.accent} text-white shadow-sm`
                              : `${colors.muted} ${isDark ? 'hover:bg-white/10' : 'hover:bg-white/80'}`
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>

                    <div className="flex-1 min-h-0 overflow-hidden p-2.5">
                      {activeTab === 'question' && (
                        <motion.div
                          key="question"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className={`h-full overflow-y-auto rounded-xl p-4 space-y-4 text-xs ${
                            isDark ? 'bg-white/[0.02] border border-white/5' : 'bg-white/70 border border-white/60'
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <span
                                className={`px-2.5 py-0.5 rounded-lg border font-bold capitalize ${
                                  isDark ? DIFF_COLORS_DARK[selected.difficulty] : DIFF_COLORS[selected.difficulty]
                                }`}
                              >
                                {selected.difficulty}
                              </span>
                              {progress.completedChallenges.includes(selected.id) && (
                                <span className="flex items-center gap-1 text-green-500 text-[11px] font-semibold">
                                  <CheckCircle size={12} />
                                  Solved
                                </span>
                              )}
                            </div>
                            <h2 className={`text-base font-bold leading-snug ${colors.text}`}>{selected.title}</h2>
                          </div>

                          <div>
                            <p className={`text-[10px] font-bold uppercase tracking-wider ${colors.muted} mb-1.5`}>
                              Scenario
                            </p>
                            <p
                              className={`italic px-3 py-2.5 rounded-xl leading-relaxed ${
                                isDark
                                  ? 'bg-amber-900/15 border border-amber-700/25 text-amber-200'
                                  : 'bg-amber-50 border border-amber-200 text-amber-900'
                              }`}
                            >
                              {selected.scenario}
                            </p>
                          </div>

                          <div>
                            <p className={`text-[10px] font-bold uppercase tracking-wider ${colors.muted} mb-1.5`}>
                              Problem
                            </p>
                            <p className={`leading-relaxed ${colors.text}`}>{selected.description}</p>
                          </div>

                          <div>
                            <p className={`text-[10px] font-bold uppercase tracking-wider ${colors.muted} mb-1.5`}>
                              Tags
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {selected.tags.map(tag => (
                                <span
                                  key={tag}
                                  className={`text-[10px] px-2.5 py-1 rounded-lg ${
                                    isDark ? 'bg-white/10 text-slate-300' : 'bg-gray-100 text-gray-700'
                                  }`}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div>
                            <p className={`text-[10px] font-bold uppercase tracking-wider ${colors.muted} mb-1.5`}>
                              Reward
                            </p>
                            <span
                              className={`text-xs font-bold px-3 py-1.5 rounded-xl inline-flex ${
                                isDark
                                  ? 'bg-yellow-900/25 text-yellow-300 border border-yellow-700/30'
                                  : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                              }`}
                            >
                              +{selected.xpReward} XP
                            </span>
                          </div>
                        </motion.div>
                      )}

                      {activeTab === 'output' && (
                        <motion.div
                          key="output"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="h-full flex flex-col rounded-xl overflow-hidden border border-gray-700/40 bg-[#141414] shadow-inner"
                        >
                          <div className="flex-1 min-h-0 overflow-y-auto font-mono text-xs">
                            {!hasConsoleOutput && testResults.length === 0 && !running && (
                              <div className="flex items-center justify-center h-full text-gray-500 px-4">
                                <p className="text-xs text-center">Click Run to see your output here</p>
                              </div>
                            )}

                            {runtimeError && (
                              <div className="m-2.5 rounded-lg border border-red-900/50 bg-red-950/50 px-3 py-2.5">
                                <div className="flex items-center gap-1.5 text-red-400 font-semibold mb-1">
                                  <AlertTriangle size={12} />
                                  Runtime Error
                                </div>
                                <p className="text-red-300 whitespace-pre-wrap break-words">{runtimeError}</p>
                              </div>
                            )}

                            {(logs.length > 0 || (running && !runtimeError)) && (
                              <div className="m-2.5 rounded-lg border border-gray-800 bg-[#1a1a1a] px-3 py-2.5">
                                <div className="flex items-center gap-1.5 text-green-500/80 font-semibold mb-1.5">
                                  <Terminal size={12} />
                                  console.log
                                </div>
                                {logs.length === 0 && running ? (
                                  <p className="text-gray-500 italic">…</p>
                                ) : (
                                  logs.map((line, i) => (
                                    <p
                                      key={i}
                                      className="text-green-400 whitespace-pre-wrap break-words leading-relaxed"
                                    >
                                      {line}
                                    </p>
                                  ))
                                )}
                              </div>
                            )}

                            {stderr.length > 0 && (
                              <div className="m-2.5 rounded-lg border border-gray-800 bg-[#1a1a1a] px-3 py-2.5">
                                <div className="flex items-center gap-1.5 text-red-400/80 font-semibold mb-1.5">
                                  <AlertTriangle size={12} />
                                  console.error
                                </div>
                                {stderr.map((line, i) => (
                                  <p
                                    key={i}
                                    className="text-red-400 whitespace-pre-wrap break-words leading-relaxed"
                                  >
                                    {line}
                                  </p>
                                ))}
                              </div>
                            )}

                            {testResults.length > 0 && (
                              <div className="m-2.5 space-y-1.5">
                                {allPassed && (
                                  <div className="rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white px-3 py-2 font-bold text-center text-[11px] shadow-sm">
                                    All tests passed! +{selected.xpReward} XP
                                  </div>
                                )}
                                {testResults.map((r, i) => (
                                  <div
                                    key={i}
                                    className={`flex items-start gap-2 p-2 rounded-lg border text-[11px] ${
                                      r.passed
                                        ? 'bg-green-500/10 border-green-500/30'
                                        : 'bg-red-500/10 border-red-500/30'
                                    }`}
                                  >
                                    <span className="shrink-0">{r.passed ? '✓' : '✗'}</span>
                                    <div className="flex-1 min-w-0">
                                      {r.hidden ? (
                                        <span className="text-gray-400">
                                          Hidden test {r.passed ? 'passed' : 'failed'}
                                        </span>
                                      ) : (
                                        <div className="space-y-0.5 text-gray-300">
                                          <div>
                                            Expected:{' '}
                                            <code className={r.passed ? 'text-green-400' : 'text-yellow-400'}>
                                              {r.expected}
                                            </code>
                                          </div>
                                          {!r.passed && (
                                            <div>
                                              Got: <code className="text-red-400">{r.got || 'nothing'}</code>
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="shrink-0 border-t border-gray-800 p-2.5">
                            <button
                              onClick={clearConsole}
                              disabled={!hasConsoleOutput}
                              className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border border-gray-700 text-gray-400 hover:bg-white/5 transition-all disabled:opacity-40"
                            >
                              <Trash2 size={11} />
                              Clear Console
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className={`flex items-center justify-center py-24 ${colors.muted}`}>
                <p className="text-sm">Select a challenge to start coding</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
