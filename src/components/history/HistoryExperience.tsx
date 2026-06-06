import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── SVG Characters ───────────────────────────────────────────────────────────

function BrendanCharacter({ mood = 'happy', scale = 1 }: { mood?: string; scale?: number }) {
  const w = 110 * scale, h = 170 * scale;
  return (
    <svg width={w} height={h} viewBox="0 0 110 170">
      {/* Shadow */}
      <ellipse cx="55" cy="165" rx="30" ry="6" fill="rgba(0,0,0,0.15)" />
      {/* Hair */}
      <ellipse cx="55" cy="32" rx="28" ry="10" fill="#5C3D1E" />
      <path d="M30 35 Q28 20 38 18 Q42 14 48 22" stroke="#5C3D1E" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M80 35 Q82 20 72 18 Q68 14 62 22" stroke="#5C3D1E" strokeWidth="5" fill="none" strokeLinecap="round" />
      {/* Head */}
      <circle cx="55" cy="46" r="28" fill="#FBBF24" stroke="#000" strokeWidth="2.5" />
      {/* Glasses frame */}
      <rect x="32" y="40" width="15" height="11" rx="4" fill="none" stroke="#1f2937" strokeWidth="2.5" />
      <rect x="63" y="40" width="15" height="11" rx="4" fill="none" stroke="#1f2937" strokeWidth="2.5" />
      <line x1="47" y1="45.5" x2="63" y2="45.5" stroke="#1f2937" strokeWidth="2" />
      <line x1="31" y1="45.5" x2="26" y2="47" stroke="#1f2937" strokeWidth="2" />
      <line x1="78" y1="45.5" x2="83" y2="47" stroke="#1f2937" strokeWidth="2" />
      {/* Eyes */}
      <circle cx="39.5" cy="45.5" r="3.5" fill="#1f2937" />
      <circle cx="70.5" cy="45.5" r="3.5" fill="#1f2937" />
      <circle cx="40.5" cy="44.5" r="1" fill="white" />
      <circle cx="71.5" cy="44.5" r="1" fill="white" />
      {/* Eyebrows */}
      {mood === 'shocked' && <>
        <path d="M34 36 Q39.5 32 45 36" stroke="#5C3D1E" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M65 36 Q70.5 32 76 36" stroke="#5C3D1E" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </>}
      {mood !== 'shocked' && <>
        <path d="M34 38 Q39.5 35 45 38" stroke="#5C3D1E" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M65 38 Q70.5 35 76 38" stroke="#5C3D1E" strokeWidth="2" fill="none" strokeLinecap="round" />
      </>}
      {/* Mouth */}
      {mood === 'happy' && <path d="M45 57 Q55 65 65 57" stroke="#000" strokeWidth="2.5" fill="none" strokeLinecap="round" />}
      {mood === 'shocked' && <ellipse cx="55" cy="60" rx="7" ry="9" fill="#1f2937" />}
      {mood === 'tired' && <path d="M45 59 Q55 57 65 59" stroke="#000" strokeWidth="2" fill="none" strokeLinecap="round" />}
      {mood === 'proud' && <path d="M44 57 Q55 66 66 57" stroke="#000" strokeWidth="3" fill="none" strokeLinecap="round" />}
      {mood === 'excited' && <path d="M43 56 Q55 68 67 56" stroke="#000" strokeWidth="3" fill="none" strokeLinecap="round" />}
      {/* Sweat drop (tired) */}
      {mood === 'tired' && <path d="M78 38 Q81 32 78 28 Q75 32 78 38" fill="#93c5fd" />}
      {/* Body - hoodie */}
      <rect x="22" y="74" width="66" height="72" rx="14" fill="#3B82F6" stroke="#000" strokeWidth="2.5" />
      {/* Hoodie pocket */}
      <path d="M35 110 Q55 120 75 110" stroke="#000" strokeWidth="2" fill="none" />
      {/* Left arm */}
      <path d="M22 84 Q5 95 8 115" stroke="#3B82F6" strokeWidth="16" strokeLinecap="round" fill="none" />
      <path d="M22 84 Q5 95 8 115" stroke="#000" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Right arm */}
      <path d="M88 84 Q105 95 102 115" stroke="#3B82F6" strokeWidth="16" strokeLinecap="round" fill="none" />
      <path d="M88 84 Q105 95 102 115" stroke="#000" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Coffee cup */}
      <rect x="90" y="108" width="18" height="16" rx="4" fill="white" stroke="#000" strokeWidth="2" />
      <path d="M108 112 Q115 112 108 120" stroke="#000" strokeWidth="2" fill="none" />
      <rect x="90" y="108" width="18" height="5" rx="2" fill="#7C3AED" />
      <path d="M94 107 Q96 102 94 97" stroke="#d1d5db" strokeWidth="1.5" fill="none" />
      <path d="M99 107 Q101 102 99 97" stroke="#d1d5db" strokeWidth="1.5" fill="none" />
      {/* Legs */}
      <rect x="28" y="142" width="20" height="24" rx="8" fill="#1f2937" stroke="#000" strokeWidth="2" />
      <rect x="62" y="142" width="20" height="24" rx="8" fill="#1f2937" stroke="#000" strokeWidth="2" />
    </svg>
  );
}

function ExecCharacter({ mood = 'serious' }: { mood?: string }) {
  return (
    <svg width="100" height="160" viewBox="0 0 100 160">
      <ellipse cx="50" cy="155" rx="28" ry="5" fill="rgba(0,0,0,0.1)" />
      {/* Hair */}
      <ellipse cx="50" cy="28" rx="24" ry="7" fill="#6b7280" />
      {/* Head */}
      <circle cx="50" cy="40" r="24" fill="#FCD9B4" stroke="#000" strokeWidth="2.5" />
      {/* Eyes */}
      <circle cx="42" cy="38" r="3" fill="#1f2937" />
      <circle cx="58" cy="38" r="3" fill="#1f2937" />
      <circle cx="43" cy="37" r="1" fill="white" />
      <circle cx="59" cy="37" r="1" fill="white" />
      {/* Eyebrows (stern) */}
      <path d="M37 31 Q42 29 47 31" stroke="#6b7280" strokeWidth="2.5" fill="none" />
      <path d="M53 31 Q58 29 63 31" stroke="#6b7280" strokeWidth="2.5" fill="none" />
      {/* Mouth */}
      {mood === 'serious' && <line x1="43" y1="52" x2="57" y2="52" stroke="#000" strokeWidth="2" strokeLinecap="round" />}
      {mood === 'shocked' && <ellipse cx="50" cy="53" rx="6" ry="7" fill="#1f2937" />}
      {mood === 'happy' && <path d="M43 51 Q50 57 57 51" stroke="#000" strokeWidth="2" fill="none" />}
      {/* Suit body */}
      <rect x="18" y="64" width="64" height="70" rx="12" fill="#1f2937" stroke="#000" strokeWidth="2.5" />
      {/* White shirt */}
      <rect x="40" y="64" width="20" height="70" rx="4" fill="white" />
      {/* Red tie */}
      <path d="M46 66 L54 66 L51 90 L50 100 L49 90 Z" fill="#dc2626" stroke="#000" strokeWidth="1" />
      {/* Left arm */}
      <path d="M18 74 Q4 90 6 108" stroke="#1f2937" strokeWidth="14" strokeLinecap="round" fill="none" />
      <path d="M18 74 Q4 90 6 108" stroke="#000" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Right arm with pointing */}
      {mood === 'pointing' ? (
        <path d="M82 74 Q96 68 100 60" stroke="#1f2937" strokeWidth="14" strokeLinecap="round" fill="none" />
      ) : (
        <path d="M82 74 Q96 90 94 108" stroke="#1f2937" strokeWidth="14" strokeLinecap="round" fill="none" />
      )}
      {/* Legs */}
      <rect x="24" y="130" width="18" height="22" rx="7" fill="#374151" stroke="#000" strokeWidth="2" />
      <rect x="58" y="130" width="18" height="22" rx="7" fill="#374151" stroke="#000" strokeWidth="2" />
    </svg>
  );
}

function OwlNarrator() {
  return (
    <svg width="120" height="150" viewBox="0 0 120 150">
      <ellipse cx="60" cy="145" rx="32" ry="6" fill="rgba(0,0,0,0.15)" />
      {/* Body */}
      <ellipse cx="60" cy="100" rx="38" ry="45" fill="#92400e" stroke="#000" strokeWidth="2.5" />
      {/* Wing left */}
      <path d="M22 90 Q8 80 12 110 Q25 115 22 90" fill="#78350f" stroke="#000" strokeWidth="2" />
      {/* Wing right */}
      <path d="M98 90 Q112 80 108 110 Q95 115 98 90" fill="#78350f" stroke="#000" strokeWidth="2" />
      {/* Belly */}
      <ellipse cx="60" cy="110" rx="22" ry="28" fill="#FDE68A" />
      {/* Head */}
      <circle cx="60" cy="48" r="32" fill="#92400e" stroke="#000" strokeWidth="2.5" />
      {/* Ear tufts */}
      <path d="M40 22 Q35 8 42 14" fill="#78350f" stroke="#000" strokeWidth="2" />
      <path d="M80 22 Q85 8 78 14" fill="#78350f" stroke="#000" strokeWidth="2" />
      {/* Big eyes */}
      <circle cx="46" cy="48" r="13" fill="white" stroke="#000" strokeWidth="2.5" />
      <circle cx="74" cy="48" r="13" fill="white" stroke="#000" strokeWidth="2.5" />
      <circle cx="46" cy="48" r="8" fill="#78350f" />
      <circle cx="74" cy="48" r="8" fill="#78350f" />
      <circle cx="46" cy="48" r="4" fill="#000" />
      <circle cx="74" cy="48" r="4" fill="#000" />
      <circle cx="44" cy="46" r="2" fill="white" />
      <circle cx="72" cy="46" r="2" fill="white" />
      {/* Beak */}
      <path d="M54 56 L60 64 L66 56 Z" fill="#F59E0B" stroke="#000" strokeWidth="1.5" />
      {/* Graduation cap */}
      <ellipse cx="60" cy="20" rx="24" ry="5" fill="#1f2937" stroke="#000" strokeWidth="2" />
      <rect x="52" y="8" width="16" height="14" rx="2" fill="#1f2937" stroke="#000" strokeWidth="1.5" />
      <line x1="83" y1="19" x2="90" y2="28" stroke="#F59E0B" strokeWidth="2.5" />
      <circle cx="90" cy="30" r="4" fill="#F59E0B" />
    </svg>
  );
}

function ComputerCharacter({ glow = false }: { glow?: boolean }) {
  return (
    <svg width="130" height="130" viewBox="0 0 130 130">
      {/* Desk */}
      <rect x="0" y="110" width="130" height="10" rx="4" fill="#5C3D1E" stroke="#000" strokeWidth="2" />
      <rect x="15" y="118" width="12" height="12" rx="3" fill="#4a2f16" />
      <rect x="103" y="118" width="12" height="12" rx="3" fill="#4a2f16" />
      {/* Monitor */}
      <rect x="20" y="20" width="90" height="70" rx="8" fill="#1f2937" stroke="#000" strokeWidth="2.5" />
      {/* Screen */}
      <rect x="26" y="26" width="78" height="58" rx="4" fill={glow ? '#064e3b' : '#111827'} />
      {glow && (
        <>
          <text x="32" y="44" fontFamily="monospace" fontSize="10" fill="#34d399">{'> alert("Hello!")'}</text>
          <rect x="32" y="52" width="66" height="20" rx="4" fill="#f0fdf4" stroke="#22c55e" strokeWidth="1.5" />
          <text x="65" y="66" fontFamily="monospace" fontSize="10" fill="#15803d" textAnchor="middle">Hello, World!</text>
          <text x="32" y="78" fontFamily="monospace" fontSize="9" fill="#6ee7b7">{'// JavaScript!'}</text>
        </>
      )}
      {!glow && (
        <>
          <text x="32" y="50" fontFamily="monospace" fontSize="10" fill="#6b7280">{'// loading...'}</text>
          <motion.text x="32" y="65" fontFamily="monospace" fontSize="10" fill="#4b5563">www</motion.text>
        </>
      )}
      {/* Monitor stand */}
      <rect x="58" y="90" width="14" height="14" rx="2" fill="#374151" stroke="#000" strokeWidth="1.5" />
      <rect x="42" y="104" width="46" height="6" rx="3" fill="#374151" stroke="#000" strokeWidth="1.5" />
      {/* Keyboard */}
      <rect x="25" y="113" width="80" height="14" rx="4" fill="#374151" stroke="#000" strokeWidth="1.5" />
      {[0,1,2,3,4,5,6].map(i => (
        <rect key={i} x={30 + i * 10} y="116" width="7" height="5" rx="1.5" fill="#4b5563" />
      ))}
    </svg>
  );
}

function JSLogoCharacter({ animated = false }: { animated?: boolean }) {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      {/* Shadow */}
      <ellipse cx="60" cy="115" rx="30" ry="5" fill="rgba(0,0,0,0.15)" />
      {/* JS badge */}
      <rect x="10" y="10" width="100" height="100" rx="18" fill="#F7DF1E" stroke="#000" strokeWidth="3" />
      {/* JS text */}
      <text x="14" y="98" fontFamily="Arial Black,sans-serif" fontSize="62" fontWeight="900" fill="#000">JS</text>
      {/* Stars if animated */}
      {animated && <>
        <circle cx="105" cy="15" r="5" fill="#fff" opacity="0.9" />
        <circle cx="15" cy="105" r="4" fill="#fff" opacity="0.7" />
        <circle cx="108" cy="100" r="3" fill="#fff" opacity="0.8" />
      </>}
    </svg>
  );
}

function CalendarCharacter({ days = 10 }: { days?: number }) {
  return (
    <svg width="120" height="130" viewBox="0 0 120 130">
      <rect x="10" y="20" width="100" height="100" rx="12" fill="white" stroke="#000" strokeWidth="3" />
      <rect x="10" y="20" width="100" height="28" rx="12" fill="#ef4444" />
      <rect x="10" y="36" width="100" height="12" fill="#ef4444" />
      <text x="60" y="40" textAnchor="middle" fontFamily="Arial Black,sans-serif" fontSize="14" fontWeight="900" fill="white">DEADLINE</text>
      {/* Ring binding */}
      <circle cx="35" cy="20" r="7" fill="none" stroke="#000" strokeWidth="3" />
      <circle cx="85" cy="20" r="7" fill="none" stroke="#000" strokeWidth="3" />
      {/* Big number */}
      <text x="60" y="105" textAnchor="middle" fontFamily="Arial Black,sans-serif" fontSize="64" fontWeight="900" fill="#ef4444">{days}</text>
      <text x="60" y="122" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="11" fontWeight="bold" fill="#6b7280">DAYS LEFT</text>
    </svg>
  );
}

// ─── Speech Bubble ────────────────────────────────────────────────────────────

function SpeechBubble({ text, side = 'bottom', color = 'white' }: { text: string; side?: 'bottom' | 'left' | 'right'; color?: string }) {
  return (
    <div className="relative">
      <div
        className="relative rounded-3xl px-6 py-4 shadow-lg max-w-sm border-2 border-black"
        style={{ background: color }}
      >
        <p className="text-base font-bold text-gray-900 leading-snug font-comic">{text}</p>
        {/* Tail */}
        {side === 'bottom' && (
          <div className="absolute -bottom-4 left-10">
            <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[16px]" style={{ borderTopColor: 'black' }} />
            <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[14px] absolute -top-[3px] left-[2px]" style={{ borderTopColor: color }} />
          </div>
        )}
        {side === 'left' && (
          <div className="absolute -left-4 top-6">
            <div className="w-0 h-0 border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent border-r-[16px] border-r-black" />
            <div className="w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-r-[14px] absolute top-[2px] left-[3px]" style={{ borderRightColor: color }} />
          </div>
        )}
        {side === 'right' && (
          <div className="absolute -right-4 top-6">
            <div className="w-0 h-0 border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent border-l-[16px] border-l-black" />
            <div className="w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-l-[14px] absolute top-[2px] right-[3px]" style={{ borderLeftColor: color }} />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Typewriter Hook ──────────────────────────────────────────────────────────

function useTypewriter(text: string, speed = 28) {
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

interface ComicScene {
  id: string;
  year: string;
  title: string;
  bgFrom: string; bgTo: string;
  character: 'brendan' | 'exec' | 'owl' | 'computer' | 'computer-glow' | 'jslogo' | 'calendar';
  characterMood: string;
  characterSide: 'left' | 'right';
  bubbleLines: string[];
  bubbleColor: string;
  caption: string;
  choices?: { text: string; next: string }[];
  next?: string;
  sfx?: string;
}

const SCENES: ComicScene[] = [
  {
    id: 'intro',
    year: '📅 1995',
    title: 'A World Without JavaScript',
    bgFrom: '#0f172a', bgTo: '#1e3a5f',
    character: 'computer',
    characterMood: 'normal',
    characterSide: 'right',
    bubbleLines: ['The internet just opened to the public...', 'But websites? Total snoozefest. 😴', 'Just text. No clicks. No magic. Nothing.'],
    bubbleColor: '#fef9c3',
    caption: '🦉 Professor Byte explains...',
    choices: [
      { text: "Who's going to fix this?", next: 'meet-brendan' },
      { text: 'What happened next?', next: 'netscape' },
    ],
  },
  {
    id: 'netscape',
    year: '🏢 Netscape HQ, 1995',
    title: 'The Big Boss Has a Plan',
    bgFrom: '#1c1917', bgTo: '#292524',
    character: 'exec',
    characterMood: 'serious',
    characterSide: 'left',
    bubbleLines: ['We need to make the web ALIVE!', 'Find me the best programmer.', 'And tell him... he has TEN DAYS. 😈'],
    bubbleColor: '#fee2e2',
    caption: '💼 The Netscape boss makes a call...',
    next: 'meet-brendan',
  },
  {
    id: 'meet-brendan',
    year: '🧑‍💻 Enter: Brendan Eich',
    title: 'Meet the Hero of Our Story!',
    bgFrom: '#14532d', bgTo: '#166534',
    character: 'brendan',
    characterMood: 'happy',
    characterSide: 'right',
    bubbleLines: ["Hi! I'm Brendan. 👋", "I just joined Netscape...", "They gave me a... special task. 😅"],
    bubbleColor: '#d1fae5',
    caption: '☕ Armed with coffee and big dreams...',
    choices: [
      { text: '"What task?!"', next: 'deadline' },
      { text: "Brendan seems nice!", next: 'deadline' },
    ],
  },
  {
    id: 'deadline',
    year: '⏰ The Countdown Begins',
    title: 'TEN DAYS. ONE Language.',
    bgFrom: '#7f1d1d', bgTo: '#991b1b',
    character: 'calendar',
    characterMood: 'normal',
    characterSide: 'right',
    bubbleLines: ["Build a programming language from SCRATCH.", "It has to be easy enough for beginners.", "You have... 10 days. Good luck! 🫡"],
    bubbleColor: '#fee2e2',
    caption: '😱 Most languages take YEARS to build!',
    next: 'coding',
  },
  {
    id: 'coding',
    year: '🌙 Late Nights & Coffee',
    title: 'Brendan Gets to Work!',
    bgFrom: '#1e1b4b', bgTo: '#312e81',
    character: 'brendan',
    characterMood: 'tired',
    characterSide: 'left',
    bubbleLines: ["Day 1: Coffee. Code. Coffee. Code.", "Day 5: I think I've got something!", "Day 10: IT. IS. DONE. 🎉"],
    bubbleColor: '#e0e7ff',
    caption: '10 days of pure coding magic ✨',
    choices: [
      { text: "What did it do?!", next: 'first-js' },
      { text: "Show me the magic!", next: 'first-js' },
    ],
  },
  {
    id: 'first-js',
    year: '💡 The First JavaScript Program',
    title: "alert('Hello, World!')",
    bgFrom: '#064e3b', bgTo: '#065f46',
    character: 'computer-glow',
    characterMood: 'glow',
    characterSide: 'right',
    bubbleLines: ["One line of code...", "And the browser SPOKE!", "A popup appeared! 🪄 Magic was born."],
    bubbleColor: '#d1fae5',
    caption: '🌟 The web just became interactive!',
    next: 'naming',
  },
  {
    id: 'naming',
    year: '📣 The Marketing Decision',
    title: "Why Is It Called JavaScript?",
    bgFrom: '#78350f', bgTo: '#92400e',
    character: 'exec',
    characterMood: 'happy',
    characterSide: 'left',
    bubbleLines: ["It was first called... Mocha! ☕", "Then LiveScript. Then...", "JAVASCRIPT! Java was famous. We borrowed the name. 😂"],
    bubbleColor: '#fef3c7',
    caption: '🤣 Java + Script = confused millions!',
    next: 'legacy',
  },
  {
    id: 'legacy',
    year: '🌍 Today — 2024',
    title: 'JavaScript Took Over the World!',
    bgFrom: '#4c1d95', bgTo: '#5b21b6',
    character: 'jslogo',
    characterMood: 'animated',
    characterSide: 'right',
    bubbleLines: ["Used on 98% of ALL websites 🌐", "Powers: React, Node.js, VS Code, Netflix...", "1 language. 30 years. BILLIONS of devices! 🚀"],
    bubbleColor: '#ede9fe',
    caption: '⚡ All from 10 sleepless days in 1995!',
    choices: [
      { text: "I want to learn it! 🎯", next: 'your-turn' },
      { text: "That's incredible! Let's go!", next: 'your-turn' },
    ],
  },
  {
    id: 'your-turn',
    year: '🎓 Your Story Starts Now',
    title: "It's YOUR Turn to Sprint!",
    bgFrom: '#831843', bgTo: '#9d174d',
    character: 'brendan',
    characterMood: 'excited',
    characterSide: 'right',
    bubbleLines: ["He had 10 days. You have 5.", "Same language. WAY better tools.", "Ready to write YOUR first line of JavaScript? 🎉"],
    bubbleColor: '#fce7f3',
    caption: "🚀 Let's GO! The adventure begins...",
    choices: [
      { text: "LET'S START! 🚀", next: 'done' },
    ],
  },
];

// ─── Background Elements ──────────────────────────────────────────────────────

function SceneBackground({ scene }: { scene: ComicScene }) {
  const stars = scene.id === 'intro' || scene.id === 'coding';
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Gradient */}
      <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${scene.bgFrom}, ${scene.bgTo})` }} />

      {/* Halftone dots pattern */}
      <div className="absolute inset-0 opacity-[0.06]" style={{
        backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }} />

      {/* Stars */}
      {stars && Array.from({ length: 25 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            width: Math.random() * 3 + 1,
            height: Math.random() * 3 + 1,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 70}%`,
          }}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 3 }}
        />
      ))}

      {/* Panel border (comic style) */}
      <div className="absolute inset-2 rounded-3xl border-4 border-black/20 pointer-events-none" />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface HistoryExperienceProps {
  onComplete: () => void;
}

export default function HistoryExperience({ onComplete }: HistoryExperienceProps) {
  const [sceneId, setSceneId] = useState('intro');
  const [lineIndex, setLineIndex] = useState(0);
  const [showChoices, setShowChoices] = useState(false);

  const scene = SCENES.find(s => s.id === sceneId)!;
  const currentLine = scene.bubbleLines[lineIndex];
  const { displayed, done, skip } = useTypewriter(currentLine, 26);

  const sceneIndex = SCENES.findIndex(s => s.id === sceneId);

  const goToScene = (id: string) => {
    if (id === 'done') { onComplete(); return; }
    setSceneId(id);
    setLineIndex(0);
    setShowChoices(false);
  };

  const advance = () => {
    if (!done) { skip(); return; }
    if (lineIndex < scene.bubbleLines.length - 1) {
      setLineIndex(prev => prev + 1);
      setShowChoices(false);
    } else {
      if (scene.choices) setShowChoices(true);
      else if (scene.next) goToScene(scene.next);
    }
  };

  // Auto-advance when typing done and it's the last line with no choices/next
  const isLastLine = lineIndex === scene.bubbleLines.length - 1;

  const characterComponent = (() => {
    switch (scene.character) {
      case 'brendan': return <BrendanCharacter mood={scene.characterMood} scale={1} />;
      case 'exec': return <ExecCharacter mood={scene.characterMood} />;
      case 'owl': return <OwlNarrator />;
      case 'computer': return <ComputerCharacter glow={false} />;
      case 'computer-glow': return <ComputerCharacter glow={true} />;
      case 'jslogo': return <JSLogoCharacter animated={true} />;
      case 'calendar': return <CalendarCharacter days={10} />;
    }
  })();

  return (
    <div className="fixed inset-0 z-40 flex flex-col overflow-hidden" style={{ fontFamily: "'Comic Sans MS', 'Chalkboard SE', cursive" }}>
      <SceneBackground scene={scene} />

      {/* Progress dots */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {SCENES.map((s, i) => (
          <div key={s.id} className={`rounded-full border-2 border-white/60 transition-all duration-300 ${i === sceneIndex ? 'w-6 h-3 bg-white' : i < sceneIndex ? 'w-3 h-3 bg-white/70' : 'w-3 h-3 bg-white/20'}`} />
        ))}
      </div>

      {/* Skip button */}
      <button
        onClick={onComplete}
        className="absolute top-4 right-4 z-20 px-3 py-1.5 rounded-xl bg-black/40 hover:bg-black/60 text-white text-xs font-bold border border-white/20 transition-all"
      >
        Skip Story →
      </button>

      {/* Main scene area */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 pt-14 pb-4">

        <AnimatePresence mode="wait">
          <motion.div
            key={sceneId}
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.04, y: -20 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="w-full max-w-3xl"
          >
            {/* Year & Title */}
            <div className="text-center mb-4">
              <span className="inline-block px-4 py-1 rounded-full bg-black/50 text-white text-xs font-bold border border-white/30 mb-2">
                {scene.year}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white drop-shadow-lg" style={{ textShadow: '3px 3px 0 rgba(0,0,0,0.5)' }}>
                {scene.title}
              </h2>
            </div>

            {/* Comic panel */}
            <div className="rounded-3xl border-4 border-black shadow-2xl overflow-hidden" style={{ background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(8px)' }}>
              <div className={`flex items-end gap-4 p-6 min-h-[260px] sm:min-h-[300px] ${scene.characterSide === 'right' ? 'flex-row' : 'flex-row-reverse'}`}>

                {/* Character */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="flex-shrink-0"
                >
                  {characterComponent}
                </motion.div>

                {/* Speech bubble area */}
                <div className="flex-1 flex flex-col gap-3">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={sceneId + '-' + lineIndex}
                      initial={{ opacity: 0, scale: 0.85, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <SpeechBubble
                        text={displayed}
                        side={scene.characterSide === 'right' ? 'left' : 'right'}
                        color={scene.bubbleColor}
                      />
                    </motion.div>
                  </AnimatePresence>

                  {/* Line dots indicator */}
                  <div className="flex gap-1.5 pl-4">
                    {scene.bubbleLines.map((_, i) => (
                      <div key={i} className={`h-2 rounded-full transition-all duration-300 ${i === lineIndex ? 'w-5 bg-white' : i < lineIndex ? 'w-2 bg-white/60' : 'w-2 bg-white/20'}`} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Caption bar */}
              <div className="bg-black/60 px-6 py-2 border-t-2 border-black/30">
                <p className="text-white/80 text-xs font-bold italic">{scene.caption}</p>
              </div>
            </div>

            {/* Choices or Next button */}
            <div className="mt-4">
              <AnimatePresence mode="wait">
                {showChoices && scene.choices ? (
                  <motion.div
                    key="choices"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col sm:flex-row gap-3 justify-center"
                  >
                    {scene.choices.map((c, i) => (
                      <motion.button
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.12 }}
                        onClick={() => goToScene(c.next)}
                        className="px-6 py-3 rounded-2xl font-extrabold text-base text-black bg-white border-4 border-black hover:scale-105 hover:-translate-y-1 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] active:shadow-none active:translate-x-1 active:translate-y-1"
                      >
                        {c.text}
                      </motion.button>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div key="next" className="flex justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <button
                      onClick={advance}
                      className="flex items-center gap-2 px-8 py-3 rounded-2xl font-extrabold text-base text-black bg-white border-4 border-black hover:scale-105 hover:-translate-y-1 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] active:shadow-none active:translate-x-1 active:translate-y-1"
                    >
                      {!done ? 'Skip ⏭' : isLastLine && !scene.choices && !scene.next ? '🎉 The End!' : 'Next →'}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
