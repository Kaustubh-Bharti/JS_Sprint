# JS Sprint - Architecture Documentation

## Overview
JS Sprint is an interactive JavaScript learning platform built with React, TypeScript, and Tailwind CSS. It's designed to teach JavaScript fundamentals through a 5-day gamified learning experience with a practice arena, historical narrative, and progress tracking system.

---

## 1. Folder Structure

```
JS_Sprint/
├── src/
│   ├── components/
│   │   ├── history/
│   │   │   └── HistoryExperience.tsx      # Interactive JS history narrative
│   │   ├── landing/
│   │   │   ├── Hero.tsx                   # Welcome hero section
│   │   │   ├── FeaturesSection.tsx        # Feature highlights
│   │   │   ├── RoadmapSection.tsx         # 5-day curriculum overview
│   │   │   ├── SkillTest.tsx              # Entry-level assessment
│   │   │   └── LandingPage.tsx            # Landing page container
│   │   ├── layout/
│   │   │   └── Navbar.tsx                 # Top navigation bar
│   │   ├── learning/
│   │   │   ├── CodeEditor.tsx             # Monaco-based code editor
│   │   │   ├── OutputConsole.tsx          # Execution output display
│   │   │   ├── VisualExplainer.tsx        # Concept visualization
│   │   │   ├── TopicPage.tsx              # Lesson page with editor
│   │   │   └── LearnPage.tsx              # Curriculum day selector
│   │   ├── motivation/
│   │   │   └── Dashboard.tsx              # Progress stats & achievements
│   │   └── practice/
│   │       └── PracticeArena.tsx          # Challenge problem solver
│   ├── contexts/
│   │   └── ThemeContext.tsx               # Global theme state management
│   ├── data/
│   │   ├── curriculum.ts                  # 5-day lesson plans (13 lessons)
│   │   ├── problems.ts                    # 10+ coding challenges
│   │   ├── achievements.ts                # Badge system (10 badges)
│   │   └── historyStory.ts                # JS history scenes
│   ├── hooks/
│   │   ├── useTheme.ts                    # Re-export from ThemeContext
│   │   └── useProgress.ts                 # Progress tracking hook
│   ├── utils/
│   │   ├── storage.ts                     # localStorage management
│   │   └── seasonDetector.ts              # Season-based theme detection
│   ├── App.tsx                            # Main app router & layout
│   ├── main.tsx                           # React DOM entry point
│   └── index.css                          # Global styles & Tailwind directives
├── index.html                             # HTML template
├── vite.config.ts                         # Vite build config
├── tsconfig.json                          # TypeScript config
├── tailwind.config.js                     # Tailwind CSS config
├── postcss.config.js                      # PostCSS config
└── package.json                           # Dependencies
```

---

## 2. Main Pages and Routes

The app uses **client-side navigation** (no React Router) with a state-based page system.

### Pages (`Page` type):
1. **`landing`** - Home page with hero, features, roadmap, and skill test
2. **`learn`** - Curriculum browser with 5 days × lesson selector
3. **`practice`** - Challenge arena with 10+ coding problems
4. **`history`** - Interactive narrative about JavaScript's creation
5. **`dashboard`** - Progress stats, XP bar, badge showcase

### Navigation Flow
```
App.tsx (AppInner component)
├── State: page, learnStartDay
├── navigate() function routes between pages
└── Renders current page based on state
```

---

## 3. Component Hierarchy

### Top-Level Structure
```
App (ThemeProvider wrapper)
└── AppInner
    ├── Navbar (fixed top)
    └── Page Content (conditional rendering)
        ├── LandingPage
        │   ├── Hero
        │   ├── FeaturesSection
        │   ├── RoadmapSection
        │   └── SkillTest (modal)
        ├── LearnPage
        │   └── TopicPage (when day selected)
        │       ├── CodeEditor (Monaco)
        │       ├── OutputConsole
        │       ├── VisualExplainer
        │       └── Lesson controls (prev/next)
        ├── PracticeArena
        │   ├── ChallengeList (sidebar)
        │   ├── CodeEditor (Monaco)
        │   ├── OutputConsole
        │   └── Test case runner
        ├── HistoryExperience (story scenes)
        └── Dashboard
            ├── XP progress bar
            ├── Stats grid
            └── Badge showcase
```

### Component Breakdown

#### Landing Components
- **Hero**: CTA buttons, main pitch ("Learn JS in 5 days")
- **FeaturesSection**: Feature cards (learn, practice, gamify, build)
- **RoadmapSection**: Day cards with unlock progression
- **SkillTest**: Modal to assess starting point and recommend starting day
- **LandingPage**: Orchestrates landing sections

#### Learning Components
- **CodeEditor**: Monaco Editor with dark theme, syntax highlighting
  - Props: `value`, `onChange`, `height`, `readOnly`
  - 2-space tabs, word wrap, minimap disabled
- **OutputConsole**: Displays executed code output or errors
- **VisualExplainer**: Concept diagrams and explanations
- **TopicPage**: Full lesson UI with code editor, output, hints
  - Tracks lesson completion, shows hints, triggers confetti on success
- **LearnPage**: Shows all days, handles unlock logic (50% previous day = unlock)

#### Practice Components
- **PracticeArena**: Main challenge solver
  - Filters challenges by difficulty (easy/medium/hard)
  - Shows test case results
  - Handles XP rewards and completion tracking
- **ChallengeList**: Sidebar with problem navigation
- Code execution via sandboxed `new Function()` with custom console

#### History Component
- **HistoryExperience**: Interactive story scenes about Brendan Eich and JavaScript creation
- Scene-based dialogue with choices that navigate story
- Characters: Narrator, Brendan Eich, Netscape Executive

#### Dashboard Component
- **Dashboard**: Shows all progress stats
- Stats: XP, level, streak, lessons done, challenges done, badges earned
- XP level progression (100 XP = 1 level)
- Day-by-day lesson completion bars
- Badge grid with earned vs locked badges

#### Navbar
- **Navbar**: Fixed top nav with:
  - Logo (clicking goes home)
  - Desktop nav items
  - XP/Streak pills
  - Theme switcher (6 themes: spring, summer, autumn, winter, moonlight, starry)

---

## 4. Theme System

### Architecture
- **Provider**: `ThemeProvider` wraps entire app
- **Hook**: `useTheme()` or `useThemeContext()` (both work)
- **Storage**: `localStorage.setItem('jssprint_theme', theme)`
- **Auto-detection**: Season-based fallback using Indian seasons

### Theme Modes (6 total)
1. **Light Themes (Auto-seasonal)**
   - **Spring**: Rose/Pink gradients
   - **Summer**: Amber/Orange gradients
   - **Autumn**: Orange/Red gradients
   - **Winter**: Blue/Cyan gradients

2. **Dark Themes (Manual)**
   - **Moonlight**: Slate/Blue gradient
   - **Starry Night**: Indigo/Purple gradient

### Color System
Each theme provides:
- `bg`: Page background gradient
- `card`: Component background (semi-transparent white)
- `accent`: Primary gradient for buttons/CTAs
- `text`: Foreground text color
- `muted`: Secondary text color
- `border`: Border color
- `nav`: Navbar background
- `badgeBg/badgeText/badgeBorder`: Badge styling
- `highlight`: Text gradient
- `xpBg/xpText/xpBar`: XP pill styling
- `streakBg/streakText`: Streak pill styling

### Season Detection
```typescript
export function getIndianSeason(): Season {
  const month = new Date().getMonth() + 1;
  if (month >= 2 && month <= 4) return 'spring';    // Feb-Apr
  if (month >= 5 && month <= 8) return 'summer';    // May-Aug
  if (month >= 9 && month <= 11) return 'autumn';   // Sep-Nov
  return 'winter';                                   // Dec-Jan
}
```

---

## 5. Practice Section Implementation

### Data Structure
```typescript
interface Challenge {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  day: number;                    // Which day's curriculum it covers
  scenario: string;               // Real-world context
  description: string;            // Problem statement
  starterCode: string;            // Template code
  testCases: Array<{
    input: string;                // Function call string
    expected: string;             // Expected output
    hidden?: boolean;             // Hidden from user initially
  }>;
  hints: string[];
  xpReward: number;               // XP for completion
  tags: string[];                 // Topics (arrays, loops, etc.)
}
```

### Challenge Library (10+ challenges)
- **Easy (Days 1-3)**: Basic concepts
  - Temperature Converter, Grade Calculator, FizzBuzz, Array Sum
- **Medium (Days 3-4)**: Intermediate concepts
  - Longest Word, Object Inspector, Array Manipulation
- **Hard (Days 4-5)**: Advanced concepts
  - Complex algorithms, recursion, object transformations

### Code Execution Engine
```javascript
function runUserCode(code: string) {
  const output: string[] = [];
  const customConsole = { log: (...args) => output.push(...) };
  const fn = new Function('console', code);
  fn(customConsole);  // Sandboxed execution
  return output;
}
```

### Test Case Evaluation
- Runs starter code + test input assertion
- Compares output to expected result
- Shows passing/failing test badges
- Prevents XP reward until all tests pass

### UI Flow
1. User selects challenge from left sidebar
2. Challenge description, scenario, starter code shown
3. Edit code in Monaco editor
4. Click "Run" → executes code + test cases
5. View output and test results
6. Click "Submit" when confident
7. Earn XP and mark challenge complete

---

## 6. Learn Section Implementation

### Data Structure
```typescript
interface Lesson {
  id: string;                    // 'day1-lesson1', etc.
  title: string;
  objective: string;             // What you'll learn
  explanation: string;           // Concept intro
  hint: string;                  // Quick tip
  starterCode: string;           // Initial code template
  solutionCode: string;          // Reference solution (hidden)
  expectedOutput: string;        // Expected console output
  afterExplanation: string;      // Deeper explanation post-completion
  xpReward: number;
}

interface Day {
  id: number;                    // 1-5
  title: string;                 // e.g., "Variables & Data Types"
  subtitle: string;              // e.g., "Day 1 — The Building Blocks"
  icon: string;                  // Emoji
  color: string;                 // Tailwind gradient
  lessons: Lesson[];             // 2-4 lessons per day
}
```

### Curriculum (5 Days)
**Day 1: Variables & Data Types** (4 lessons, 90 XP)
- Your First Variable
- Numbers & Math
- String Magic
- True or False

**Day 2: Conditions & Loops** (3 lessons, 75 XP)
- If / Else
- For Loops
- While Loops

**Day 3: Functions & Arrays** (3 lessons, ?)
- Functions & Parameters
- Array Basics
- Array Methods

**Days 4-5**: Objects, Async, Advanced (implied but not fully shown)

### Lesson Flow
1. LearnPage shows all days with:
   - Progress bar (% of day complete)
   - Lock icon if < 50% of previous day done
   - Completion badge if all lessons done
2. Click day → TopicPage loads first lesson
3. TopicPage UI:
   - Explanation at top
   - CodeEditor with starter code
   - Run button → OutputConsole shows result
   - If no error: shows afterExplanation
   - Next button → advances to next lesson
4. Completion:
   - XP added to progress
   - Lesson marked in completedLessons[]
   - Triggers badge checks

### Unlock Logic
```typescript
const isDayUnlocked = (dayIndex: number) => {
  if (dayIndex === 0) return true;  // Day 1 always unlocked
  const prevDay = curriculum[dayIndex - 1];
  const { done, total } = getDayProgress(prevDay);
  return done >= Math.ceil(total * 0.5);  // 50% of previous day
};
```

---

## 7. JS History Implementation

### Data Structure
```typescript
interface HistoryScene {
  id: string;
  year: string;
  title: string;
  background: string;           // bg-gradient class
  character: string;            // Who's speaking
  dialogue: string[];
  choices?: Array<{
    text: string;
    next: string;               // Scene ID to navigate to
    effect?: string;            // Visual/narrative effect
  }>;
  next?: string;                // Auto-advance scene ID
}
```

### Story Arc (15+ scenes)
- **Intro (1995)**: The Internet Explosion
- **Act 1**: Meet Brendan Eich, Netscape's vision
- **Act 2**: The 10-day sprint, deadline pressure
- **Act 3**: Naming controversy (Java marketing)
- **Act 4**: First JavaScript code, browser adoption
- **Act 5**: Evolution through ES6, modern era
- **Epilogue**: JavaScript today

### Characters
- **Brendan Eich**: Creator of JavaScript (with SVG character)
- **Netscape Executive**: Companies' goals
- **Narrator**: Exposition and history

### SVG Characters
- **BrendanCharacter**: Full SVG with glasses, hoodie, coffee cup
  - Moods: happy, shocked, tired, proud, excited
- **ExecCharacter**: Suit-wearing business character
  - Moods: serious, shocked, happy, pointing

### Navigation
- Users see dialogue
- Click choices to branch story
- Scenes can auto-advance or require user interaction
- Scene backgrounds change with gradients
- Completion triggers XP rewards and badge checks

---

## 8. State Management

### Architecture: Props + React Hooks
- **No Redux/Zustand** - Props drilling for navigation
- **ThemeContext** - Global theme state
- **useProgress hook** - Wraps localStorage for progress

### Global State

#### ThemeContext
```typescript
interface ThemeContextValue {
  theme: ThemeMode;
  setTheme: (t: ThemeMode) => void;
  isDark: boolean;
  colors: typeof themeColors[ThemeMode];
}
```

### Local/Session State

#### App.tsx (AppInner)
```typescript
const [page, setPage] = useState<Page>('landing');
const [learnStartDay, setLearnStartDay] = useState<number | undefined>();
```

#### LearnPage
```typescript
const [selectedDay, setSelectedDay] = useState<number | null>();
const [selectedLessonIndex, setSelectedLessonIndex] = useState(0);
```

#### TopicPage
```typescript
const [code, setCode] = useState(lesson.starterCode);
const [output, setOutput] = useState<string[]>([]);
const [error, setError] = useState<string | null>();
const [running, setRunning] = useState(false);
const [showExplanation, setShowExplanation] = useState(false);
const [showHint, setShowHint] = useState(false);
const [hasRun, setHasRun] = useState(false);
const [justCompleted, setJustCompleted] = useState(false);
```

#### PracticeArena
```typescript
const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>();
const [code, setCode] = useState('');
const [testResults, setTestResults] = useState([]);
const [filter, setFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
```

#### HistoryExperience
```typescript
const [currentSceneId, setCurrentSceneId] = useState('intro');
const [displayedText, setDisplayedText] = useState(0);  // Dialogue animation
```

---

## 9. Progress Tracking Storage

### Storage System: localStorage
- **Key**: `jssprint_progress` (JSON string)
- **Type**: `UserProgress` interface

### UserProgress Schema
```typescript
interface UserProgress {
  xp: number;                      // Total experience points (0+)
  level: number;                   // Calculated from XP (floor(xp / 100) + 1)
  streak: number;                  // Consecutive days visited
  lastVisit: string;               // Date string (new Date().toDateString())
  completedLessons: string[];      // Array of lesson IDs
  completedChallenges: string[];   // Array of challenge IDs
  badges: string[];                // Array of earned badge IDs
  totalTimeSpent: number;          // Total minutes spent (tracked but not shown)
  currentDay: number;              // Current curriculum day (1-5)
}

// Default state
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
```

### useProgress Hook Functions
```typescript
function loadProgress(): UserProgress
function saveProgress(progress: UserProgress): void
function addXP(amount: number): UserProgress
function markLessonComplete(lessonId: string): UserProgress
function markChallengeComplete(challengeId: string): UserProgress
function updateStreak(): UserProgress
function unlockBadge(badgeId: string): UserProgress
```

### Streak Logic
```typescript
const today = new Date().toDateString();
if (progress.lastVisit !== today) {
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  if (progress.lastVisit === yesterday) {
    progress.streak += 1;  // Continue streak
  } else if (progress.lastVisit !== today) {
    progress.streak = 1;   // Reset to 1
  }
  progress.lastVisit = today;
}
```

### XP & Level System
- **XP per Lesson**: 20-25 XP
- **XP per Challenge**: 30-50 XP (based on difficulty)
- **Level Threshold**: 100 XP per level
- **Level Formula**: `level = floor(xp / 100) + 1`
- **Progress to Next Level**: `(xp % 100) / 100 * 100%`

### Badge System (10 Badges)
```typescript
interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  condition: (xp, completedLessons, completedChallenges, streak) => boolean;
}
```

**Badges**:
1. **First Step**: Complete 1st lesson
2. **Hot Streak**: Maintain 3-day streak
3. **Variable Master**: Complete Day 1
4. **Logic Lord**: Complete Day 2
5. **Function Ninja**: Complete Day 3
6. **Century Club**: Earn 100 XP
7. **XP Legend**: Earn 500 XP
8. **Arena Rookie**: Complete 1st challenge
9. **Problem Solver**: Complete 5 challenges
10. **JS Sprinter**: Complete all 5 days (13 lessons)

### Badge Checking Flow
```typescript
const checkBadges = (p: UserProgress) => {
  badges.forEach(badge => {
    if (!p.badges.includes(badge.id) && 
        badge.condition(p.xp, p.completedLessons, p.completedChallenges, p.streak)) {
      p.badges.push(badge.id);
      saveProgress(p);
    }
  });
};
```

### Progress Updates Trigger
- Lesson completion → `completeLesson(lessonId, xp)`
- Challenge completion → `completeChallenge(challengeId, xp)`
- XP earn → `earnXP(amount)`
- Streak check → `updateStreak()` (on app init)
- Each saves to localStorage and updates React state

---

## 10. Key Libraries & Tools

### Core Dependencies
- **React 18.3.1** - UI framework
- **TypeScript 5.5.3** - Type safety
- **Vite 5.4.2** - Build tool
- **React Router DOM 7.17.0** - (installed but not used; client-side nav instead)

### UI & Styling
- **Tailwind CSS 3.4.1** - Utility-first CSS
- **Framer Motion 12.40.0** - Animations (motion, AnimatePresence)
- **Lucide React 0.344.0** - Icon library

### Code Execution & Editing
- **Monaco Editor (@monaco-editor/react 4.7.0)** - Code editor UI
- **Canvas Confetti 1.9.4** - Celebration effects

### Data & Services
- **Supabase JS 2.57.4** - (installed but not used in analyzed files)

### Dev Tools
- **ESLint 9.9.1** - Code linting
- **TypeScript ESLint 8.3.0** - TS linting
- **Autoprefixer 10.4.18** - CSS vendor prefixing
- **PostCSS 8.4.35** - CSS processing

---

## 11. Code Execution Safety

### Sandboxing Approach
Code is executed in a sandboxed context using `new Function()`:

```javascript
const fn = new Function('console', code);
fn({ 
  log: (...args) => output.push(...),
  warn: (...args) => output.push(...),
  error: (...args) => output.push(...),
  info: (...args) => output.push(...)
});
```

**Safety Notes**:
- User code cannot access DOM or external APIs
- Only `console` methods available
- `Function()` constructor allows dynamic code but in isolated scope
- No access to `window`, `document`, or other globals
- Output is captured and displayed safely

### Error Handling
```javascript
try {
  const fn = new Function('console', code);
  fn(customConsole);
  return { output, error: null };
} catch (e) {
  return { output, error: e.message };
}
```

---

## 12. Performance Optimizations

### Bundle Optimization
- **Monaco Editor**: Excluded from optimizeDeps (lazy-loaded)
- **Vite**: Uses esbuild for fast builds
- **Code Splitting**: Components lazy-load with Framer Motion

### Runtime Optimizations
- **Memoization**: `useCallback` for navigation handlers
- **Conditional Rendering**: Pages only render when selected
- **Theme Caching**: Theme colors defined as constant object (not recreated)
- **Motion Animations**: Smooth transitions with Framer Motion

### Storage Optimization
- Single localStorage key `jssprint_progress` for all user data
- JSON serialization/deserialization

---

## 13. File Dependencies Map

### Data Dependencies
```
curriculum.ts
  ├─ Used by: LearnPage, TopicPage, Dashboard
  └─ Contains: 5 Days × 2-4 lessons each

problems.ts
  ├─ Used by: PracticeArena
  └─ Contains: 10+ challenges by difficulty

achievements.ts
  ├─ Used by: useProgress, Dashboard
  └─ Contains: 10 badge definitions

historyStory.ts
  ├─ Used by: HistoryExperience
  └─ Contains: 15+ story scenes with dialogue
```

### Context/Hook Dependencies
```
ThemeContext.tsx
  ├─ Provides: theme, setTheme, isDark, colors
  └─ Used by: All pages via useTheme()

useProgress.ts
  ├─ Wraps: storage.ts functions
  ├─ Uses: curriculum.ts, achievements.ts
  └─ Used by: TopicPage, PracticeArena, Dashboard

storage.ts
  ├─ Manages: localStorage 'jssprint_progress'
  └─ Used by: useProgress.ts
```

### Component Dependencies
```
App.tsx
  ├─ Wraps: ThemeProvider
  ├─ Imports: All 5 page components
  └─ State: page, learnStartDay

Navbar.tsx
  ├─ Uses: useTheme(), useProgress()
  ├─ Imports: seasonDetector.ts (ThemeMode type)
  └─ Props: currentPage, onNavigate

LearnPage.tsx
  ├─ Uses: useTheme(), useProgress()
  ├─ Imports: curriculum.ts
  └─ Renders: TopicPage (conditional)

TopicPage.tsx
  ├─ Uses: useProgress()
  ├─ Imports: CodeEditor, OutputConsole, VisualExplainer
  └─ State: code, output, error, hint visibility

PracticeArena.tsx
  ├─ Uses: useProgress(), useTheme()
  ├─ Imports: CodeEditor, OutputConsole, problems.ts
  └─ Child: ChallengeList component

HistoryExperience.tsx
  ├─ Uses: useProgress(), useTheme()
  ├─ Imports: historyStory.ts
  ├─ SVG: BrendanCharacter, ExecCharacter
  └─ State: currentSceneId, displayedText

Dashboard.tsx
  ├─ Uses: useProgress(), useTheme()
  ├─ Imports: curriculum.ts, challenges.ts, achievements.ts
  └─ Displays: All progress stats
```

---

## 14. User Flow Diagram

```
Landing Page
├─ Hero ("Start Learning")
├─ Features Section
├─ Roadmap Section
│  └─ (Click day) → Learn Page [Day selector]
├─ CTA Button
└─ Skill Test Modal

Learn Page
├─ Day List
│  ├─ Day 1 (4 lessons) - Unlocked
│  ├─ Day 2 (3 lessons) - Locked until 50% Day 1 done
│  └─ ...
└─ (Click day) → Topic Page
    ├─ Lesson UI
    │  ├─ Explanation
    │  ├─ Code Editor
    │  ├─ Console Output
    │  └─ Buttons: Run, Hint, Next/Prev
    └─ On completion → +XP, mark lesson, check badges

Practice Page
├─ Challenge List (Sidebar)
│  ├─ Filter by difficulty
│  └─ (Click challenge) → loads challenge
└─ Challenge Editor
    ├─ Description + Scenario
    ├─ Code Editor
    ├─ Test Case Results
    └─ On all tests pass → +XP, mark complete, check badges

History Page
└─ Scene Dialogue
    ├─ Character SVG
    ├─ Dialogue
    ├─ User Choices
    └─ (Choice) → Next Scene

Dashboard Page
├─ XP Bar (progress to next level)
├─ Stats Grid (6 stats cards)
├─ Day Progress Bars
└─ Badge Showcase (Earned + Locked)

Navbar (Always visible)
├─ Logo (← Back to landing)
├─ Nav Items (Home, Learn, Practice, History, Progress)
├─ XP/Streak Pills
└─ Theme Switcher (6 themes)
```

---

## 15. Gamification Elements

### XP System
- **Earning**: Lessons (20-25 XP), Challenges (30-50 XP)
- **Levels**: 100 XP per level
- **Visualization**: XP bar + level number in navbar

### Streaks
- Increments daily on first app visit
- Resets if skip a day
- Displayed in navbar pill
- Badge goal: 3-day streak

### Badges (10 total)
- Earned dynamically based on conditions
- Displayed in Dashboard
- Motivate specific goals (first lesson, first challenge, complete a day, etc.)

### Progression Locks
- Days unlock at 50% previous day completion
- Encourages linear learning path

### Visual Feedback
- Confetti animation on lesson completion
- Smooth animations with Framer Motion
- Progress bars with gradient colors
- Icons and emojis for context

---

## 16. Configuration Files

### vite.config.ts
```typescript
defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],  // Lazy load icons
  },
})
```

### tailwind.config.js
- Default Tailwind setup
- Color schemes align with theme colors

### tsconfig.json
- TypeScript 5.5.3
- JSX support
- Strict mode enabled

### eslint.config.js
- ESLint 9 flat config
- React Hooks rules
- React Refresh support

---

## Summary Table

| Feature | Type | Storage | Tracking |
|---------|------|---------|----------|
| Theme | Global State | localStorage | themeContext |
| Progress | User Data | localStorage | useProgress hook |
| Lessons | Content | hardcoded | completedLessons[] |
| Challenges | Content | hardcoded | completedChallenges[] |
| XP/Level | Calculated | localStorage | addXP(), level math |
| Streak | Calculated | localStorage | updateStreak() daily |
| Badges | Dynamic | localStorage | checkBadges() |
| Navigation | Component State | React state | App.tsx |
| Code Output | Session | React state | TopicPage/PracticeArena |

---

## Key Design Decisions

1. **No Router**: Client-side navigation via state instead of React Router
2. **No Backend**: All data hardcoded; localStorage for persistence
3. **No Database**: Single localStorage key with JSON serialization
4. **Theme Context**: Global for easy access across all components
5. **Sandbox Execution**: `new Function()` for safe code evaluation
6. **Props Drilling**: Navigation passed via props (no Redux needed)
7. **Framer Motion**: Animations for engagement without complexity
8. **Tailwind CSS**: Utility-first for rapid theming
9. **TypeScript**: Full type safety for developer experience
10. **Lesson Unlock Logic**: 50% completion gates to encourage finishing

---

**Document Last Updated**: June 2026
**Version**: 1.0
