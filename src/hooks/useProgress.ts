import { useState, useEffect, useCallback } from 'react';
import { loadProgress, saveProgress, updateStreak, UserProgress, addXP as addXPStorage, markLessonComplete as markLessonStorage, markChallengeComplete as markChallengeStorage } from '../utils/storage';
import { badges } from '../data/achievements';

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(loadProgress);

  useEffect(() => {
    const updated = updateStreak();
    setProgress(updated);
  }, []);

  const earnXP = useCallback((amount: number) => {
    const updated = addXPStorage(amount);
    setProgress({ ...updated });
    checkBadges(updated);
    return updated;
  }, []);

  const completeLesson = useCallback((lessonId: string, xp: number) => {
    const updated = markLessonStorage(lessonId);
    updated.xp += xp;
    updated.level = Math.floor(updated.xp / 100) + 1;
    saveProgress(updated);
    setProgress({ ...updated });
    checkBadges(updated);
  }, []);

  const completeChallenge = useCallback((challengeId: string, xp: number) => {
    const updated = markChallengeStorage(challengeId);
    updated.xp += xp;
    updated.level = Math.floor(updated.xp / 100) + 1;
    saveProgress(updated);
    setProgress({ ...updated });
    checkBadges(updated);
  }, []);

  const checkBadges = (p: UserProgress) => {
    badges.forEach(badge => {
      if (!p.badges.includes(badge.id) && badge.condition(p.xp, p.completedLessons, p.completedChallenges, p.streak)) {
        p.badges.push(badge.id);
        saveProgress(p);
        setProgress({ ...p });
      }
    });
  };

  const xpToNextLevel = 100;
  const xpInCurrentLevel = progress.xp % xpToNextLevel;
  const xpProgress = (xpInCurrentLevel / xpToNextLevel) * 100;

  return { progress, earnXP, completeLesson, completeChallenge, xpProgress };
}
