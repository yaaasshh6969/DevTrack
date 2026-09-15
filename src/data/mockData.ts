export interface HeatmapDay {
  date: Date;
  hours: number;
  intensity: number; // 0-4
}

export interface RoadmapTopic {
  name: string;
  complete: boolean;
  hours?: number;
}

export interface RoadmapItem {
  id: string;
  name: string;
  description: string;
  color: string;
  badgeColor: string;
  progress: number;
  status: 'complete' | 'in-progress' | 'locked';
  hoursSpent: number;
  estimatedHours: number;
  startDate: string | null;
  completedDate: string | null;
  topics: RoadmapTopic[];
  resources: string[];
  currentFocus?: string;
}

export interface LogEntry {
  id: number;
  date: string;
  topic: string;
  subtopic: string;
  module: string;
  moduleColor: string;
  hours: number;
  notes: string;
  resources: string[];
  tags: string[];
  mood: number;
}

export interface SquadMember {
  name: string;
  initials: string;
  color: string;
  streak: number;
  weeklyHours: number;
  role: string;
  isOnline: boolean;
}

// ── User ──────────────────────────────────────────────────────────────────────

export const user = {
  name: 'Alex Chen',
  username: 'alexchen',
  initials: 'AC',
  streak: 47,
  longestStreak: 62,
  totalHours: 284.5,
  roadmapCompletion: 38,
  todayHours: 1.5,
  todayGoal: 3.0,
  weeklyGoal: 15,
  joinDate: '2024-02-15',
  currentModule: 'React',
  level: 'Intermediate',
};

// ── Roadmap ───────────────────────────────────────────────────────────────────

export const roadmapItems: RoadmapItem[] = [
  {
    id: 'html-css',
    name: 'HTML & CSS',
    description: 'Semantic HTML, CSS layouts, Flexbox, Grid, animations, responsive design',
    color: '#f97316',
    badgeColor: 'rgba(249, 115, 22, 0.12)',
    progress: 100,
    status: 'complete',
    hoursSpent: 45,
    estimatedHours: 45,
    startDate: '2024-02-15',
    completedDate: '2024-04-08',
    topics: [
      { name: 'Semantic HTML5 Elements', complete: true, hours: 4 },
      { name: 'CSS Fundamentals & Box Model', complete: true, hours: 6 },
      { name: 'Flexbox Layout', complete: true, hours: 8 },
      { name: 'CSS Grid System', complete: true, hours: 8 },
      { name: 'Responsive Design & Media Queries', complete: true, hours: 7 },
      { name: 'CSS Animations & Transitions', complete: true, hours: 6 },
      { name: 'CSS Custom Properties & Theming', complete: true, hours: 4 },
      { name: 'Accessibility & ARIA', complete: true, hours: 4 },
    ],
    resources: ['MDN Web Docs', 'CSS Tricks', 'Kevin Powell - YouTube'],
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    description: 'Core JS fundamentals, DOM manipulation, async/await, ES6+, data structures',
    color: '#eab308',
    badgeColor: 'rgba(234, 179, 8, 0.12)',
    progress: 85,
    status: 'in-progress',
    hoursSpent: 72,
    estimatedHours: 85,
    startDate: '2024-04-09',
    completedDate: null,
    currentFocus: 'Design Patterns & Error Handling',
    topics: [
      { name: 'Variables, Types & Operators', complete: true, hours: 5 },
      { name: 'Functions, Scope & Closures', complete: true, hours: 8 },
      { name: 'Arrays & Objects Deep Dive', complete: true, hours: 9 },
      { name: 'DOM Manipulation & Events', complete: true, hours: 10 },
      { name: 'Async JS, Promises & Fetch API', complete: true, hours: 10 },
      { name: 'ES6+ Features & Modules', complete: true, hours: 10 },
      { name: 'Error Handling & Debugging', complete: false, hours: 8 },
      { name: 'JavaScript Design Patterns', complete: false, hours: 10 },
    ],
    resources: ['javascript.info', 'You Don\'t Know JS', 'Wes Bos - JS30'],
  },
  {
    id: 'react',
    name: 'React',
    description: 'Components, hooks, state management, context, React Router, performance',
    color: '#22d3ee',
    badgeColor: 'rgba(34, 211, 238, 0.12)',
    progress: 45,
    status: 'in-progress',
    hoursSpent: 38,
    estimatedHours: 85,
    startDate: '2024-07-12',
    completedDate: null,
    currentFocus: 'Context API & useReducer',
    topics: [
      { name: 'JSX & Component Fundamentals', complete: true, hours: 8 },
      { name: 'Props & Component Composition', complete: true, hours: 6 },
      { name: 'useState & useEffect Hooks', complete: true, hours: 8 },
      { name: 'Event Handling & Forms', complete: true, hours: 6 },
      { name: 'useCallback, useMemo & Performance', complete: false, hours: 8 },
      { name: 'Context API & useReducer', complete: false, hours: 10 },
      { name: 'React Router v6', complete: false, hours: 10 },
      { name: 'Custom Hooks & Patterns', complete: false, hours: 12 },
      { name: 'Testing with Jest & RTL', complete: false, hours: 10 },
    ],
    resources: ['React Docs', 'Jack Herrington - YouTube', 'Scrimba React'],
  },
  {
    id: 'nodejs',
    name: 'Node.js',
    description: 'Server-side JavaScript, file system, streams, npm ecosystem, authentication',
    color: '#4ade80',
    badgeColor: 'rgba(74, 222, 128, 0.12)',
    progress: 15,
    status: 'in-progress',
    hoursSpent: 12,
    estimatedHours: 60,
    startDate: '2024-08-20',
    completedDate: null,
    currentFocus: 'HTTP Module & Event Loop',
    topics: [
      { name: 'Node.js Architecture & Event Loop', complete: true, hours: 6 },
      { name: 'Modules & npm Ecosystem', complete: true, hours: 6 },
      { name: 'File System & Streams', complete: false, hours: 8 },
      { name: 'HTTP Module & Servers', complete: false, hours: 8 },
      { name: 'Authentication & JWT', complete: false, hours: 10 },
      { name: 'Error Handling & Middleware', complete: false, hours: 8 },
      { name: 'Testing with Jest', complete: false, hours: 8 },
      { name: 'Deployment & Environment Config', complete: false, hours: 6 },
    ],
    resources: ['Node.js Docs', 'Traversy Media - YouTube'],
  },
  {
    id: 'expressjs',
    name: 'Express.js',
    description: 'REST APIs, middleware, routing, authentication, validation, error handling',
    color: '#a78bfa',
    badgeColor: 'rgba(167, 139, 250, 0.12)',
    progress: 0,
    status: 'locked',
    hoursSpent: 0,
    estimatedHours: 40,
    startDate: null,
    completedDate: null,
    topics: [
      { name: 'Express Setup & Routing', complete: false },
      { name: 'Middleware & Request Lifecycle', complete: false },
      { name: 'REST API Design Principles', complete: false },
      { name: 'Authentication with Passport.js', complete: false },
      { name: 'Input Validation with Zod', complete: false },
      { name: 'Error Handling Patterns', complete: false },
      { name: 'Rate Limiting & Security', complete: false },
    ],
    resources: ['Express Docs', 'Brad Traversy - REST API'],
  },
  {
    id: 'mongodb',
    name: 'MongoDB',
    description: 'NoSQL databases, Mongoose ODM, aggregation, indexing, data modeling',
    color: '#86efac',
    badgeColor: 'rgba(134, 239, 172, 0.12)',
    progress: 0,
    status: 'locked',
    hoursSpent: 0,
    estimatedHours: 35,
    startDate: null,
    completedDate: null,
    topics: [
      { name: 'MongoDB Fundamentals & Atlas', complete: false },
      { name: 'Mongoose ODM & Schema Design', complete: false },
      { name: 'CRUD Operations & Queries', complete: false },
      { name: 'Aggregation Pipeline', complete: false },
      { name: 'Indexing & Performance', complete: false },
      { name: 'Data Relationships & Embedding', complete: false },
    ],
    resources: ['MongoDB University', 'Mongoose Docs'],
  },
];

// ── Log Entries ───────────────────────────────────────────────────────────────

export const logEntries: LogEntry[] = [
  {
    id: 1,
    date: '2026-09-02',
    topic: 'React Context API',
    subtopic: 'useContext & Provider Pattern',
    module: 'React',
    moduleColor: '#22d3ee',
    hours: 1.5,
    notes:
      'Built a theme context system with dark/light toggle. Understood why over-using Context causes unnecessary re-renders. Will revisit after learning Zustand.',
    resources: ['React Docs – Context', 'Kent C. Dodds – Context Module Pattern'],
    tags: ['React', 'Context', 'State Management'],
    mood: 4,
  },
  {
    id: 2,
    date: '2026-09-01',
    topic: 'JavaScript Closures',
    subtopic: 'Module Pattern & Factory Functions',
    module: 'JavaScript',
    moduleColor: '#eab308',
    hours: 2.0,
    notes:
      'Deep dived into lexical scope and how closures enable private state. Implemented a counter module and a memoization function using closures.',
    resources: ['MDN – Closures', 'javascript.info – Closure'],
    tags: ['JavaScript', 'Closures', 'Scope'],
    mood: 5,
  },
  {
    id: 3,
    date: '2026-08-31',
    topic: 'React Performance',
    subtopic: 'useCallback & useMemo Optimization',
    module: 'React',
    moduleColor: '#22d3ee',
    hours: 2.5,
    notes:
      'Profiled a component tree in React DevTools and identified unnecessary re-renders. Applied useCallback to event handlers and useMemo for expensive computed values.',
    resources: ['React Docs – Hooks', 'Jack Herrington – React Performance YT'],
    tags: ['React', 'Performance', 'Optimization'],
    mood: 4,
  },
  {
    id: 4,
    date: '2026-08-30',
    topic: 'Node.js Event Loop',
    subtopic: 'Phases & Microtask Queue',
    module: 'Node.js',
    moduleColor: '#4ade80',
    hours: 3.0,
    notes:
      'Studied the libuv event loop phases in detail. The difference between setImmediate and process.nextTick finally clicked. Drew a diagram to solidify understanding.',
    resources: ['Node.js Docs – Event Loop', 'Fireship – Event Loop Video'],
    tags: ['Node.js', 'Async', 'Event Loop'],
    mood: 3,
  },
  {
    id: 5,
    date: '2026-08-29',
    topic: 'React Custom Hooks',
    subtopic: 'useFetch & useLocalStorage',
    module: 'React',
    moduleColor: '#22d3ee',
    hours: 2.0,
    notes:
      'Extracted data fetching logic into a useFetch hook with loading/error states. Also built a useLocalStorage hook that persists state across page reloads.',
    resources: ['useHooks.com', 'Scrimba – Custom Hooks Course'],
    tags: ['React', 'Hooks', 'Abstraction'],
    mood: 5,
  },
  {
    id: 6,
    date: '2026-08-28',
    topic: 'ES6+ Features',
    subtopic: 'Destructuring, Spread & Optional Chaining',
    module: 'JavaScript',
    moduleColor: '#eab308',
    hours: 1.5,
    notes:
      'Refactored some old code using modern JS syntax. Optional chaining removed a lot of verbose null checks. Nullish coalescing is perfect for default values.',
    resources: ['javascript.info – Modern JS'],
    tags: ['JavaScript', 'ES6', 'Syntax'],
    mood: 4,
  },
  {
    id: 7,
    date: '2026-08-27',
    topic: 'Node.js Modules',
    subtopic: 'CommonJS vs ES Modules',
    module: 'Node.js',
    moduleColor: '#4ade80',
    hours: 1.0,
    notes:
      'Short session due to meetings. Got confused about CJS vs ESM interop in Node 18. Will revisit tomorrow with more time.',
    resources: ['Node.js Docs – Modules'],
    tags: ['Node.js', 'Modules'],
    mood: 2,
  },
  {
    id: 8,
    date: '2026-08-26',
    topic: 'React useEffect',
    subtopic: 'Cleanup Functions & Dependency Arrays',
    module: 'React',
    moduleColor: '#22d3ee',
    hours: 2.5,
    notes:
      'Finally understood the cleanup function in useEffect. Prevented a memory leak in a timer component. Also debugged an infinite loop caused by an object dependency.',
    resources: ['React Docs – useEffect', 'Dan Abramov – Complete Guide to useEffect'],
    tags: ['React', 'Hooks', 'useEffect'],
    mood: 5,
  },
];

// ── Heatmap Data ──────────────────────────────────────────────────────────────

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453123;
  return x - Math.floor(x);
}

export function generateHeatmapData(): HeatmapDay[][] {
  const today = new Date(2026, 8, 2); // Sep 2, 2026
  const streakStart = new Date(2026, 6, 17); // July 17, 2026 (47 days ago)

  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 52 * 7);
  startDate.setDate(startDate.getDate() - startDate.getDay()); // back to Sunday

  const weeks: HeatmapDay[][] = [];

  for (let w = 0; w < 53; w++) {
    const week: HeatmapDay[] = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + w * 7 + d);

      let hours = 0;
      let intensity = 0;

      if (date <= today) {
        if (date >= streakStart) {
          // Current streak: always active, 1.5–4h
          const r = seededRandom(w * 100 + d + 999);
          hours = +(1.5 + r * 2.5).toFixed(1);
          intensity = hours < 2 ? 2 : hours < 3 ? 3 : 4;
        } else {
          const isWeekend = d === 0 || d === 6;
          const rand = seededRandom(w * 100 + d);
          const threshold = isWeekend ? 0.42 : 0.25;

          if (rand > threshold) {
            const hr = seededRandom(w * 100 + d + 500);
            hours = +(0.5 + hr * 3).toFixed(1);
            intensity = hours < 1 ? 1 : hours < 2 ? 2 : hours < 3 ? 3 : 4;
          }
        }
      }

      week.push({ date: new Date(date), hours, intensity });
    }
    weeks.push(week);
  }

  return weeks;
}

// ── Weekly Chart ──────────────────────────────────────────────────────────────

export const weeklyChartData = [
  { day: 'Mon', hours: 2.5, goal: 3 },
  { day: 'Tue', hours: 3.0, goal: 3 },
  { day: 'Wed', hours: 1.5, goal: 3 },
  { day: 'Thu', hours: 3.5, goal: 3 },
  { day: 'Fri', hours: 2.0, goal: 3 },
  { day: 'Sat', hours: 3.0, goal: 3 },
  { day: 'Sun', hours: 1.5, goal: 3 },
];

// ── Gamification ─────────────────────────────────────────────────────────────

export const gamification = {
  level: 14,
  levelName: 'Full Stack Learner',
  xp: 2847,
  xpToNext: 3500,
  badges: [
    { id: 'streak-30', name: '30 Day Streak', emoji: '🔥', earned: true, xp: 300 },
    { id: 'html-master', name: 'HTML Master', emoji: '🌐', earned: true, xp: 500 },
    { id: 'js-explorer', name: 'JS Explorer', emoji: '⚡', earned: true, xp: 450 },
    { id: 'react-padawan', name: 'React Padawan', emoji: '⚛️', earned: true, xp: 400 },
    { id: '100-hours', name: '100 Hour Club', emoji: '💎', earned: true, xp: 600 },
    { id: 'streak-50', name: '50 Day Streak', emoji: '🌟', earned: false, xp: 500 },
    { id: 'node-initiate', name: 'Node Initiate', emoji: '🟢', earned: false, xp: 400 },
    { id: 'night-owl', name: 'Night Owl', emoji: '🦉', earned: false, xp: 200 },
  ],
};

// ── AI Coach Messages ─────────────────────────────────────────────────────────

export const hanaMessages = [
  {
    id: 1,
    text: "47 days, Alex. That's not motivation — that's a system. You've built something real. Now close the JavaScript gaps and push into Node.js before momentum shifts.",
    time: 'Now',
    type: 'greeting' as const,
  },
  {
    id: 2,
    text: "Top 3% globally for consistency. You already know that. What matters now: Error Handling is the only JS topic still open. Close it this week — don't leave gaps.",
    time: '8:32 AM',
    type: 'achievement' as const,
  },
  {
    id: 3,
    text: "Your strongest output day is Thursday — 3.5h average, highest-quality notes. That's not coincidence. Schedule React's hardest concepts on Thursdays. Use what works.",
    time: 'Yesterday',
    type: 'insight' as const,
  },
  {
    id: 4,
    text: "React Context jumped 10% this week. You're building real intuition for it. The Provider pattern will fully click once you wire it into an actual component tree — build something.",
    time: 'Yesterday',
    type: 'coaching' as const,
  },
  {
    id: 5,
    text: "At your current pace: React complete in ~5 weeks, then Node.js. The event-driven architecture will feel familiar by then. The path is clear — execute it.",
    time: '2 days ago',
    type: 'plan' as const,
  },
];

export const hanaQuickSuggestions = [
  "What should I focus on today?",
  "Give me a study plan for this week",
  "Explain Context API simply",
  "How am I doing overall?",
  "I'm feeling stuck on async JS",
  "Challenge me with a concept ⚡",
];

export const weeklyCoachingInsights = [
  {
    label: 'Strongest topic',
    value: 'React Hooks',
    note: 'Based on session notes quality',
    color: '#22d3ee',
    emoji: '⚛️',
  },
  {
    label: 'Needs more attention',
    value: 'Error Handling',
    note: 'Only 2 sessions logged this month',
    color: '#fbbf24',
    emoji: '⚠️',
  },
  {
    label: 'Recommended next',
    value: 'Context API',
    note: 'You\'ve built the foundation for it',
    color: '#9b5cf8',
    emoji: '🎯',
  },
  {
    label: 'This week\'s XP goal',
    value: '+850 XP',
    note: '17h logged at 50 XP/hour',
    color: '#fbbf24',
    emoji: '✨',
  },
];

// ── Squad ─────────────────────────────────────────────────────────────────────

export interface SquadActivity {
  id: number;
  member: string;
  initials: string;
  color: string;
  action: string;
  topic: string;
  hours?: number;
  timeAgo: string;
  type: 'session' | 'streak' | 'milestone' | 'badge';
}

export const squadActivity: SquadActivity[] = [
  { id: 1, member: 'Alex Chen', initials: 'AC', color: '#8b47f3', action: 'logged', topic: 'React Context API', hours: 1.5, timeAgo: '2h ago', type: 'session' },
  { id: 2, member: 'Priya Patel', initials: 'PP', color: '#a78bfa', action: 'logged', topic: 'PostgreSQL Indexing', hours: 3.0, timeAgo: '3h ago', type: 'session' },
  { id: 3, member: 'Sofia Reyes', initials: 'SR', color: '#f97316', action: 'hit a 22-day streak', topic: '', timeAgo: '4h ago', type: 'streak' },
  { id: 4, member: 'Priya Patel', initials: 'PP', color: '#a78bfa', action: 'completed stage', topic: 'PostgreSQL', timeAgo: '5h ago', type: 'milestone' },
  { id: 5, member: 'Marcus Webb', initials: 'MW', color: '#34d399', action: 'logged', topic: 'TypeScript Generics', hours: 2.0, timeAgo: '7h ago', type: 'session' },
  { id: 6, member: 'James Liu', initials: 'JL', color: '#22d3ee', action: 'logged', topic: 'CSS Grid Layout', hours: 1.0, timeAgo: '9h ago', type: 'session' },
  { id: 7, member: 'Alex Chen', initials: 'AC', color: '#8b47f3', action: 'earned badge', topic: '100 Hour Club', timeAgo: 'Yesterday', type: 'badge' },
  { id: 8, member: 'Sofia Reyes', initials: 'SR', color: '#f97316', action: 'logged', topic: 'Express Middleware', hours: 2.5, timeAgo: 'Yesterday', type: 'session' },
  { id: 9, member: 'Marcus Webb', initials: 'MW', color: '#34d399', action: 'logged', topic: 'React Router v6', hours: 1.5, timeAgo: 'Yesterday', type: 'session' },
  { id: 10, member: 'Priya Patel', initials: 'PP', color: '#a78bfa', action: 'logged', topic: 'Node.js Streams', hours: 2.5, timeAgo: '2 days ago', type: 'session' },
];

export const squadMembers: SquadMember[] = [
  {
    name: 'Priya Patel',
    initials: 'PP',
    color: '#a78bfa',
    streak: 31,
    weeklyHours: 18.5,
    role: 'Backend Focus',
    isOnline: true,
  },
  {
    name: 'Marcus Webb',
    initials: 'MW',
    color: '#34d399',
    streak: 14,
    weeklyHours: 12.0,
    role: 'Frontend Focus',
    isOnline: false,
  },
  {
    name: 'Sofia Reyes',
    initials: 'SR',
    color: '#f97316',
    streak: 22,
    weeklyHours: 9.5,
    role: 'Full-Stack',
    isOnline: true,
  },
  {
    name: 'James Liu',
    initials: 'JL',
    color: '#22d3ee',
    streak: 8,
    weeklyHours: 6.5,
    role: 'Frontend Focus',
    isOnline: false,
  },
];
