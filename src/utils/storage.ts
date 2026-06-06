export interface UserProgress {
  xp: number;
  level: number;
  streak: number;
  lastVisit: string;
  completedLessons: string[];
  completedChallenges: string[];
  badges: string[];
  totalTimeSpent: number;
  currentDay: number;
}

const DEFAULT_PROGRESS: UserProgress = {
  xp: 0,
  level: 1,
  streak: 0,
  lastVisit: '',
  completedLessons: [],
  completedChallenges: [],
  badges: [],
  totalTimeSpent: 0,
  currentDay: 1,
};

const KEY = 'jssprint_progress';

export function loadProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT_PROGRESS };
    return { ...DEFAULT_PROGRESS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_PROGRESS };
  }
}

export function saveProgress(progress: UserProgress): void {
  localStorage.setItem(KEY, JSON.stringify(progress));
}

export function addXP(amount: number): UserProgress {
  const progress = loadProgress();
  progress.xp += amount;
  progress.level = Math.floor(progress.xp / 100) + 1;
  saveProgress(progress);
  return progress;
}

export function markLessonComplete(lessonId: string): UserProgress {
  const progress = loadProgress();
  if (!progress.completedLessons.includes(lessonId)) {
    progress.completedLessons.push(lessonId);
  }
  saveProgress(progress);
  return progress;
}

export function markChallengeComplete(challengeId: string): UserProgress {
  const progress = loadProgress();
  if (!progress.completedChallenges.includes(challengeId)) {
    progress.completedChallenges.push(challengeId);
  }
  saveProgress(progress);
  return progress;
}

export function updateStreak(): UserProgress {
  const progress = loadProgress();
  const today = new Date().toDateString();
  if (progress.lastVisit !== today) {
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (progress.lastVisit === yesterday) {
      progress.streak += 1;
    } else if (progress.lastVisit !== today) {
      progress.streak = 1;
    }
    progress.lastVisit = today;
    saveProgress(progress);
  }
  return progress;
}

export function unlockBadge(badgeId: string): UserProgress {
  const progress = loadProgress();
  if (!progress.badges.includes(badgeId)) {
    progress.badges.push(badgeId);
    saveProgress(progress);
  }
  return progress;
}
