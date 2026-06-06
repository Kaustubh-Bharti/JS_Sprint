import { createContext, useContext, useState, ReactNode } from 'react';
import { ThemeMode, getDefaultTheme } from '../utils/seasonDetector';

export const themeColors: Record<ThemeMode, {
  bg: string; card: string; accent: string; text: string;
  muted: string; border: string; nav: string;
  // badge = the "Learn JS in 5 days" pill
  badgeBg: string; badgeText: string; badgeBorder: string;
  // highlight = "10 days." text gradient
  highlight: string;
  // xp pill
  xpBg: string; xpText: string; xpBar: string;
  // streak pill
  streakBg: string; streakText: string;
}> = {
  spring: {
    bg: 'bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50',
    card: 'bg-white/80',
    accent: 'from-rose-400 to-pink-500',
    text: 'text-gray-900',
    muted: 'text-gray-500',
    border: 'border-rose-200',
    nav: 'bg-white/70',
    badgeBg: 'bg-rose-100', badgeText: 'text-rose-700', badgeBorder: 'border-rose-300',
    highlight: 'from-rose-500 to-pink-500',
    xpBg: 'bg-rose-50', xpText: 'text-rose-600', xpBar: 'from-rose-400 to-pink-500',
    streakBg: 'bg-pink-50', streakText: 'text-pink-600',
  },
  summer: {
    bg: 'bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50',
    card: 'bg-white/80',
    accent: 'from-amber-400 to-orange-500',
    text: 'text-gray-900',
    muted: 'text-gray-500',
    border: 'border-amber-200',
    nav: 'bg-white/70',
    badgeBg: 'bg-amber-100', badgeText: 'text-amber-700', badgeBorder: 'border-amber-300',
    highlight: 'from-amber-400 to-orange-500',
    xpBg: 'bg-amber-50', xpText: 'text-amber-600', xpBar: 'from-amber-400 to-orange-500',
    streakBg: 'bg-orange-50', streakText: 'text-orange-600',
  },
  autumn: {
    bg: 'bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50',
    card: 'bg-white/80',
    accent: 'from-orange-500 to-red-500',
    text: 'text-gray-900',
    muted: 'text-gray-600',
    border: 'border-orange-200',
    nav: 'bg-white/70',
    badgeBg: 'bg-orange-100', badgeText: 'text-orange-700', badgeBorder: 'border-orange-300',
    highlight: 'from-orange-500 to-red-500',
    xpBg: 'bg-orange-50', xpText: 'text-orange-600', xpBar: 'from-orange-400 to-red-500',
    streakBg: 'bg-red-50', streakText: 'text-red-600',
  },
  winter: {
    bg: 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50',
    card: 'bg-white/80',
    accent: 'from-blue-400 to-cyan-500',
    text: 'text-gray-900',
    muted: 'text-gray-500',
    border: 'border-blue-200',
    nav: 'bg-white/70',
    badgeBg: 'bg-blue-100', badgeText: 'text-blue-700', badgeBorder: 'border-blue-300',
    highlight: 'from-blue-500 to-cyan-500',
    xpBg: 'bg-blue-50', xpText: 'text-blue-600', xpBar: 'from-blue-400 to-cyan-500',
    streakBg: 'bg-cyan-50', streakText: 'text-cyan-700',
  },
  moonlight: {
    bg: 'bg-gradient-to-br from-slate-950 via-slate-900 to-zinc-950',
    card: 'bg-slate-800/60',
    accent: 'from-blue-400 to-violet-500',
    text: 'text-slate-100',
    muted: 'text-slate-400',
    border: 'border-slate-700',
    nav: 'bg-slate-900/80',
    badgeBg: 'bg-blue-950/60', badgeText: 'text-blue-300', badgeBorder: 'border-blue-700',
    highlight: 'from-blue-400 to-violet-400',
    xpBg: 'bg-blue-950/60', xpText: 'text-blue-300', xpBar: 'from-blue-400 to-violet-500',
    streakBg: 'bg-violet-950/60', streakText: 'text-violet-300',
  },
  starry: {
    bg: 'bg-gradient-to-br from-indigo-950 via-slate-950 to-purple-950',
    card: 'bg-indigo-900/40',
    accent: 'from-indigo-400 to-purple-500',
    text: 'text-slate-100',
    muted: 'text-slate-400',
    border: 'border-indigo-700',
    nav: 'bg-indigo-950/80',
    badgeBg: 'bg-indigo-950/60', badgeText: 'text-indigo-300', badgeBorder: 'border-indigo-600',
    highlight: 'from-indigo-400 to-purple-400',
    xpBg: 'bg-indigo-950/60', xpText: 'text-indigo-300', xpBar: 'from-indigo-400 to-purple-500',
    streakBg: 'bg-purple-950/60', streakText: 'text-purple-300',
  },
};

interface ThemeContextValue {
  theme: ThemeMode;
  setTheme: (t: ThemeMode) => void;
  isDark: boolean;
  colors: typeof themeColors[ThemeMode];
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>(getDefaultTheme);

  const setTheme = (t: ThemeMode) => {
    localStorage.setItem('jssprint_theme', t);
    setThemeState(t);
  };

  const isDark = theme === 'moonlight' || theme === 'starry';
  const colors = themeColors[theme];

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useThemeContext must be used inside ThemeProvider');
  return ctx;
}
