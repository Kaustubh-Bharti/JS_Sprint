import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../hooks/useTheme';
import { useProgress } from '../../hooks/useProgress';
import { ThemeMode } from '../../utils/seasonDetector';
import { Zap, Flame, Menu, X, Code2, Sun, Moon } from 'lucide-react';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const LIGHT_THEMES: { id: ThemeMode; label: string; swatch: string; icon: string }[] = [
  { id: 'spring', label: 'Spring', swatch: 'from-rose-300 to-pink-400', icon: '🌸' },
  { id: 'summer', label: 'Summer', swatch: 'from-amber-300 to-orange-400', icon: '☀️' },
  { id: 'autumn', label: 'Autumn', swatch: 'from-orange-400 to-red-400', icon: '🍂' },
  { id: 'winter', label: 'Winter', swatch: 'from-blue-300 to-cyan-400', icon: '❄️' },
];

const DARK_THEMES: { id: ThemeMode; label: string; swatch: string; icon: string }[] = [
  { id: 'moonlight', label: 'Moonlight', swatch: 'from-slate-600 to-blue-700', icon: '🌙' },
  { id: 'starry', label: 'Starry Night', swatch: 'from-indigo-700 to-purple-800', icon: '✨' },
];

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const { theme, setTheme, isDark, colors } = useTheme();
  const { progress, xpProgress } = useProgress();
  const [menuOpen, setMenuOpen] = useState(false);
  const [lightOpen, setLightOpen] = useState(false);
  const [darkOpen, setDarkOpen] = useState(false);
  const lightTimer = useRef<ReturnType<typeof setTimeout>>();
  const darkTimer = useRef<ReturnType<typeof setTimeout>>();

  const openLight = () => { clearTimeout(lightTimer.current); setLightOpen(true); setDarkOpen(false); };
  const closeLight = () => { lightTimer.current = setTimeout(() => setLightOpen(false), 150); };
  const openDark = () => { clearTimeout(darkTimer.current); setDarkOpen(true); setLightOpen(false); };
  const closeDark = () => { darkTimer.current = setTimeout(() => setDarkOpen(false), 150); };

  const navItems = [
    { id: 'landing', label: 'Home' },
    { id: 'learn', label: 'Learn' },
    { id: 'practice', label: 'Practice' },
    { id: 'history', label: 'JS History' },
    { id: 'dashboard', label: 'Progress' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 ${colors.nav} backdrop-blur-md border-b ${colors.border} transition-all duration-500`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <button onClick={() => onNavigate('landing')} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${colors.accent} flex items-center justify-center shadow-lg`}>
              <Code2 size={16} className="text-white" />
            </div>
            <span className={`font-bold text-lg ${colors.text}`}>JS Sprint</span>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentPage === item.id
                    ? `bg-gradient-to-r ${colors.accent} text-white shadow-md`
                    : `${colors.muted} hover:${colors.text}`
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Right: XP + Streak + Theme Switcher */}
          <div className="hidden md:flex items-center gap-3">
            {/* Streak */}
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${colors.streakBg} border border-current/10`}>
              <Flame size={14} className={colors.streakText} />
              <span className={`text-sm font-bold ${colors.streakText}`}>{progress.streak}</span>
            </div>

            {/* XP */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${colors.xpBg} border border-current/10`}>
              <Zap size={14} className={colors.xpText} />
              <span className={`text-sm font-bold ${colors.xpText}`}>{progress.xp} XP</span>
              <div className={`w-14 h-1.5 rounded-full ${isDark ? 'bg-slate-700' : 'bg-black/10'}`}>
                <div className={`h-full rounded-full bg-gradient-to-r ${colors.xpBar} transition-all duration-500`} style={{ width: `${xpProgress}%` }} />
              </div>
              <span className={`text-xs ${colors.xpText}`}>Lv.{progress.level}</span>
            </div>

            {/* Theme switcher */}
            <div className="flex items-center gap-1">

              {/* Light themes button */}
              <div className="relative" onMouseEnter={openLight} onMouseLeave={closeLight}>
                <button
                  className={`p-2 rounded-xl transition-all duration-200 flex items-center gap-1.5 ${
                    !isDark
                      ? `bg-gradient-to-r ${colors.accent} text-white shadow-md`
                      : `${isDark ? 'text-slate-400 hover:bg-white/10' : 'text-gray-500 hover:bg-gray-100'}`
                  }`}
                >
                  <Sun size={15} />
                  {!isDark && <span className="text-xs font-semibold capitalize">{theme}</span>}
                </button>

                <AnimatePresence>
                  {lightOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className={`absolute top-full right-0 mt-2 p-2 rounded-2xl shadow-2xl border ${colors.border} ${isDark ? 'bg-slate-800' : 'bg-white'} min-w-[160px]`}
                    >
                      <p className={`text-xs font-semibold uppercase tracking-wide px-2 pb-2 ${colors.muted}`}>Light Themes</p>
                      {LIGHT_THEMES.map(t => (
                        <button
                          key={t.id}
                          onClick={() => { setTheme(t.id); setLightOpen(false); }}
                          className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl transition-all hover:scale-[1.02] ${
                            theme === t.id
                              ? isDark ? 'bg-white/10' : 'bg-gray-100'
                              : 'hover:bg-black/5'
                          }`}
                        >
                          <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${t.swatch} shadow-sm flex-shrink-0`} />
                          <span className={`text-sm font-medium ${colors.text}`}>{t.icon} {t.label}</span>
                          {theme === t.id && <span className="ml-auto text-xs">✓</span>}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Dark themes button */}
              <div className="relative" onMouseEnter={openDark} onMouseLeave={closeDark}>
                <button
                  className={`p-2 rounded-xl transition-all duration-200 flex items-center gap-1.5 ${
                    isDark
                      ? `bg-gradient-to-r ${colors.accent} text-white shadow-md`
                      : `${isDark ? 'text-slate-400 hover:bg-white/10' : 'text-gray-500 hover:bg-gray-100'}`
                  }`}
                >
                  <Moon size={15} />
                  {isDark && <span className="text-xs font-semibold capitalize">{theme}</span>}
                </button>

                <AnimatePresence>
                  {darkOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className={`absolute top-full right-0 mt-2 p-2 rounded-2xl shadow-2xl border ${colors.border} ${isDark ? 'bg-slate-800' : 'bg-white'} min-w-[160px]`}
                    >
                      <p className={`text-xs font-semibold uppercase tracking-wide px-2 pb-2 ${colors.muted}`}>Dark Themes</p>
                      {DARK_THEMES.map(t => (
                        <button
                          key={t.id}
                          onClick={() => { setTheme(t.id); setDarkOpen(false); }}
                          className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl transition-all hover:scale-[1.02] ${
                            theme === t.id
                              ? 'bg-white/10'
                              : 'hover:bg-black/5'
                          }`}
                        >
                          <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${t.swatch} shadow-sm flex-shrink-0`} />
                          <span className={`text-sm font-medium ${colors.text}`}>{t.icon} {t.label}</span>
                          {theme === t.id && <span className="ml-auto text-xs">✓</span>}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <button className={`md:hidden p-2 rounded-lg ${colors.muted}`} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`md:hidden ${colors.nav} border-t ${colors.border} px-4 py-3 space-y-1`}
          >
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => { onNavigate(item.id); setMenuOpen(false); }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentPage === item.id ? `bg-gradient-to-r ${colors.accent} text-white` : colors.muted
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="pt-2 border-t border-gray-200/30">
              <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${colors.muted}`}>Themes</p>
              <div className="flex flex-wrap gap-2">
                {[...LIGHT_THEMES, ...DARK_THEMES].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${theme === t.id ? `bg-gradient-to-r ${colors.accent} text-white` : `${colors.muted} border ${colors.border}`}`}
                  >
                    {t.icon} {t.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4 pt-2">
              <span className={`text-sm font-bold flex items-center gap-1 ${colors.streakText}`}><Flame size={13} className={colors.streakText} />{progress.streak} streak</span>
              <span className={`text-sm font-bold flex items-center gap-1 ${colors.xpText}`}><Zap size={13} className={colors.xpText} />{progress.xp} XP · Lv.{progress.level}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
