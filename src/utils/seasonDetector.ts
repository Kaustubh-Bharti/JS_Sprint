export type Season = 'spring' | 'summer' | 'autumn' | 'winter';
export type ThemeMode = Season | 'moonlight' | 'starry';

export function getIndianSeason(): Season {
  const month = new Date().getMonth() + 1;
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 8) return 'summer';
  if (month >= 9 && month <= 11) return 'autumn';
  return 'winter';
}

export function getDefaultTheme(): ThemeMode {
  const saved = localStorage.getItem('jssprint_theme') as ThemeMode | null;
  if (saved && ['spring', 'summer', 'autumn', 'winter', 'moonlight', 'starry'].includes(saved)) {
    return saved;
  }
  // Legacy 'auto' or missing → use current season
  return getIndianSeason();
}
