import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../hooks/useTheme';
import { ChevronRight, Volume2, VolumeX } from 'lucide-react';

// All character SVGs removed - this is now a pure text-based visual novel

// ─── Speech Bubble ────────────────────────────────────────────────────────────


// ─── Typewriter Hook ──────────────────────────────────────────────────────────

function useTypewriter(text: string, speed = 25) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    if (!text) return;
    let i = 0;
    const id = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(id);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);

  const skip = () => { setDisplayed(text); setDone(true); };
  return { displayed, done, skip };
}

// ─── Scene Data ───────────────────────────────────────────────────────────────

interface StoryScene {
  id: string;
  year: string;
  title: string;
  narration: string;
}

const STORY_SCENES: StoryScene[] = [
  {
    id: 's1',
    year: '1989',
    title: 'The Birth of the Web',
    narration: 'Tim Berners-Lee invents the World Wide Web at CERN. The internet exists, but it\'s boring—just text and links. No interaction. No life. Websites are like digital libraries, static and silent.',
  },
  {
    id: 's2',
    year: '1995',
    title: 'The Browser Wars Begin',
    narration: 'Netscape Navigator is born and conquers the web. But Marc Andreessen sees the future: browsers need to be smarter. Pages need to come alive. They need a programming language—a simple one that works in the browser itself.',
  },
  {
    id: 's3',
    year: 'April 1995',
    title: 'Enter Brendan Eich',
    narration: 'A brilliant 34-year-old programmer named Brendan Eich joins Netscape. He\'s been studying programming languages. He\'s ready for a challenge. Netscape has an impossible task: "Build us a language. Make it easy for beginners. You have 10 days."',
  },
  {
    id: 's4',
    year: 'May 1995',
    title: 'The 10-Day Blitz',
    narration: 'Brendan locks himself away with coffee and code. He borrows ideas from Scheme, Java, and Self. He sketches out syntax. He doesn\'t sleep much. Days blur together. But piece by piece, something magical takes shape.',
  },
  {
    id: 's5',
    year: 'May 23, 1995',
    title: 'The First JavaScript Program',
    narration: 'After 10 days of intense work, Brendan creates the first working version. He calls it "Mocha." A simple program runs: alert("Hello, World!"). A popup appears on screen. The browser is no longer silent. It speaks back to users.',
  },
  {
    id: 's6',
    year: 'December 1995',
    title: 'The Name Game',
    narration: 'The language gets renamed to "LiveScript" when it ships in Netscape 2.0. But that\'s not the final name. Sun Microsystems\' Java is taking the world by storm. Netscape makes a deal: rename it to JavaScript. Same language. Marketing genius. Confusion forever.',
  },
  {
    id: 's7',
    year: '1996–2000',
    title: 'The Browser Wars Heat Up',
    narration: 'Microsoft releases Internet Explorer with their own "JScript." The two browsers battle for dominance. JavaScript evolves, but without standards. Each browser adds different features. Developers struggle with incompatibility. But JavaScript gets stronger, more essential.',
  },
  {
    id: 's8',
    year: '1997',
    title: 'ECMAScript is Born',
    narration: 'JavaScript gets standardized as ECMAScript by ECMA International. Finally, a common standard. Different browsers can implement JavaScript the same way. The language has structure. The language has a future.',
  },
  {
    id: 's9',
    year: '2004–2008',
    title: 'Web 2.0 Revolution',
    narration: 'Google Maps appears, and suddenly JavaScript isn\'t just for form validation. It powers rich, interactive applications. Ajax allows pages to load data without refreshing. JavaScript becomes essential. Developers realize: we can build real applications in the browser.',
  },
  {
    id: 's10',
    year: '2009',
    title: 'Node.js Changes Everything',
    narration: 'Ryan Dahl releases Node.js. JavaScript escapes the browser. Now it runs on servers too. One language everywhere. Backend, frontend, same code. The community explodes. JavaScript becomes the world\'s most versatile language.',
  },
  {
    id: 's11',
    year: '2010–2020',
    title: 'The Framework Era',
    narration: 'React, Vue, Angular, Svelte—frameworks built on JavaScript transform how we build interfaces. NPM becomes the largest package registry in the world. JavaScript runs on billions of devices: phones, watches, IoT, VR headsets. One language. Everywhere.',
  },
  {
    id: 's12',
    year: 'Today',
    title: 'The Legacy',
    narration: '30 years later, JavaScript powers 98% of all websites. It powers Netflix, Uber, Airbnb, Facebook, Google. Born in 10 days, it became the most used programming language on Earth. One programmer. One impossible deadline. One language that changed the world. And your journey starts now.',
  },
];

// ─── Background Elements ──────────────────────────────────────────────────────

function AnimatedOrbs({ colors }: { colors: any }) {
  return (
    <>
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-15 pointer-events-none"
        style={{ background: `radial-gradient(circle, ${colors.accent.split(' ')[1] || '#f59e0b'}, transparent)` }}
        animate={{ scale: [1, 1.2, 1], x: [0, 40, 0], y: [0, -30, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{ background: `radial-gradient(circle, #3b82f6, transparent)` }}
        animate={{ scale: [1, 1.3, 1], x: [0, -40, 0], y: [0, 40, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />
    </>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface HistoryExperienceProps {
  onComplete: () => void;
}

export default function HistoryExperience({ onComplete }: HistoryExperienceProps) {
  const { colors, isDark } = useTheme();
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);

  const scene = STORY_SCENES[currentSceneIndex];
  const { displayed, done, skip } = useTypewriter(scene.narration, 20);

  const goToNext = () => {
    if (!done) {
      skip();
      return;
    }
    if (currentSceneIndex < STORY_SCENES.length - 1) {
      setCurrentSceneIndex(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  useEffect(() => {
    if (!autoPlay || !done) return;
    const timer = setTimeout(() => {
      goToNext();
    }, 2500);
    return () => clearTimeout(timer);
  }, [autoPlay, done, currentSceneIndex]);

  const progress = ((currentSceneIndex + 1) / STORY_SCENES.length) * 100;

  return (
    <div className={`fixed inset-0 z-50 flex flex-col overflow-hidden ${colors.bg}`}>
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <AnimatedOrbs colors={colors} />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1"
          >
            <p className={`text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Scene {currentSceneIndex + 1} of {STORY_SCENES.length}
            </p>
            <p className={`text-lg font-bold ${colors.text}`}>{scene.year}</p>
          </motion.div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setAutoPlay(!autoPlay)}
              className={`p-2 rounded-lg transition-all ${
                autoPlay
                  ? `${isDark ? 'bg-blue-500/30 text-blue-300' : 'bg-blue-100 text-blue-600'}`
                  : `${isDark ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-gray-100 text-gray-600'}`
              }`}
              title={autoPlay ? 'Pause autoplay' : 'Start autoplay'}
            >
              {autoPlay ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>

            <button
              onClick={onComplete}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                isDark
                  ? 'hover:bg-white/10 text-slate-300'
                  : 'hover:bg-gray-200 text-gray-700'
              }`}
            >
              Skip →
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <motion.div
          className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
          initial={{ width: '0%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />

        {/* Main Story Area */}
        <div className="flex-1 overflow-auto flex items-center justify-center p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSceneIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="w-full max-w-3xl"
            >
              {/* Title and Year */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center mb-12"
              >
                <p className={`text-lg font-semibold mb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {scene.year}
                </p>
                <h1 className={`text-4xl sm:text-5xl font-black mb-8 ${colors.text}`}>
                  {scene.title}
                </h1>
                <div className="w-24 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent mx-auto" />
              </motion.div>

              {/* Narration Box */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className={`rounded-2xl p-8 sm:p-10 border-2 ${
                  isDark
                    ? 'bg-slate-900/80 border-slate-700/50 text-slate-100'
                    : 'bg-white/80 border-slate-200 text-slate-900'
                } backdrop-blur-md shadow-2xl`}
              >
                <p className="text-lg sm:text-xl leading-relaxed font-medium">
                  {displayed}
                  {!done && <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.6, repeat: Infinity }} className="ml-1">▋</motion.span>}
                </p>
              </motion.div>

              {/* Reading Time Estimate */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className={`text-center mt-8 text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}
              >
                {done && (
                  <p>
                    {autoPlay ? '⏳ Auto-playing in 2.5s...' : 'Press any key or click to continue'}
                  </p>
                )}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Controls */}
        <div className="border-t border-white/10 backdrop-blur-sm p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              {STORY_SCENES.map((_, i) => (
                <motion.div
                  key={i}
                  className={`h-2 rounded-full transition-all ${
                    i === currentSceneIndex
                      ? 'w-8 bg-blue-500'
                      : i < currentSceneIndex
                      ? 'w-2 bg-slate-500'
                      : 'w-2 bg-slate-600/50'
                  }`}
                />
              ))}
            </div>

            <motion.button
              onClick={goToNext}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold transition-all hover:shadow-lg"
            >
              {!done ? 'Skip Text' : currentSceneIndex === STORY_SCENES.length - 1 ? 'Begin Journey →' : 'Next →'}
              <ChevronRight size={20} />
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Click anywhere to advance */}
      <div
        onClick={goToNext}
        className="absolute inset-0 z-0 cursor-pointer"
      />
    </div>
  );
}
