import { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { useTheme } from './hooks/useTheme';
import Navbar from './components/layout/Navbar';
import LandingPage from './components/landing/LandingPage';
import LearnPage from './components/learning/LearnPage';
import PracticeArena from './components/practice/PracticeArena';
import HistoryExperience from './components/history/HistoryExperience';
import Dashboard from './components/motivation/Dashboard';

type Page = 'landing' | 'learn' | 'practice' | 'history' | 'dashboard';
interface NavExtra { startDay?: number }

function AppInner() {
  const { colors } = useTheme();
  const [page, setPage] = useState<Page>('landing');
  const [learnStartDay, setLearnStartDay] = useState<number | undefined>(undefined);

  const navigate = (target: string, extra?: unknown) => {
    const p = target as Page;
    if (p === 'learn' && extra && (extra as NavExtra).startDay) {
      setLearnStartDay((extra as NavExtra).startDay);
    } else if (p === 'learn') {
      setLearnStartDay(undefined);
    }
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen ${colors.bg} transition-all duration-500`}>
      <Navbar currentPage={page} onNavigate={navigate} />
      {page === 'landing' && <LandingPage onNavigate={navigate} />}
      {page === 'learn' && <LearnPage startDay={learnStartDay} />}
      {page === 'practice' && <PracticeArena />}
      {page === 'history' && <HistoryExperience onComplete={() => navigate('learn')} />}
      {page === 'dashboard' && <Dashboard />}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  );
}
