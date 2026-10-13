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

// ── Clean User Profile Default ────────────────────────────────────────────────

export const user = {
  name: 'Alex Chen',
  username: 'alexchen',
  initials: 'AC',
  streak: 1,
  longestStreak: 1,
  totalHours: 0,
  roadmapCompletion: 0,
  todayHours: 0,
  todayGoal: 3.0,
  weeklyGoal: 15,
  joinDate: new Date().toISOString().split('T')[0],
  currentModule: 'HTML & CSS',
  level: 'Beginner',
};

// ── Clean Full-Stack Tech Roadmap ──────────────────────────────────────────────

export const roadmapItems: RoadmapItem[] = [
  {
    id: 'html-css',
    name: 'HTML & CSS',
    description: 'Semantic HTML5, CSS Grid, Flexbox, Animations & Responsive Design',
    color: '#06b6d4',
    badgeColor: 'rgba(6, 182, 212, 0.14)',
    progress: 0,
    status: 'in-progress',
    hoursSpent: 0,
    estimatedHours: 45,
    startDate: new Date().toISOString().split('T')[0],
    completedDate: null,
    currentFocus: 'Semantic HTML5 & Modern Layouts',
    topics: [
      { name: 'Semantic HTML5 Elements', complete: false, hours: 4 },
      { name: 'CSS Fundamentals & Box Model', complete: false, hours: 6 },
      { name: 'Flexbox Layout System', complete: false, hours: 8 },
      { name: 'CSS Grid System', complete: false, hours: 8 },
      { name: 'Responsive Design & Media Queries', complete: false, hours: 7 },
      { name: 'CSS Custom Properties & Animations', complete: false, hours: 6 },
    ],
    resources: ['MDN Web Docs', 'CSS Tricks'],
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    description: 'Core ES6+, Async/Await, DOM, Closures, Data Structures & Modules',
    color: '#ffb800',
    badgeColor: 'rgba(255, 184, 0, 0.14)',
    progress: 0,
    status: 'locked',
    hoursSpent: 0,
    estimatedHours: 85,
    startDate: null,
    completedDate: null,
    topics: [
      { name: 'Variables, Scope & Closures', complete: false, hours: 8 },
      { name: 'Arrays & Objects Deep Dive', complete: false, hours: 9 },
      { name: 'DOM Manipulation & Events', complete: false, hours: 10 },
      { name: 'Async JS, Promises & Fetch API', complete: false, hours: 10 },
      { name: 'ES6+ Modules & Architecture', complete: false, hours: 10 },
    ],
    resources: ['javascript.info', 'You Don\'t Know JS'],
  },
  {
    id: 'react',
    name: 'React',
    description: 'Components, Custom Hooks, State Management, Router & Performance',
    color: '#a855f7',
    badgeColor: 'rgba(168, 85, 247, 0.14)',
    progress: 0,
    status: 'locked',
    hoursSpent: 0,
    estimatedHours: 85,
    startDate: null,
    completedDate: null,
    topics: [
      { name: 'JSX & Component Fundamentals', complete: false, hours: 8 },
      { name: 'useState & useEffect Hooks', complete: false, hours: 8 },
      { name: 'Context API & State Management', complete: false, hours: 10 },
      { name: 'React Router v6', complete: false, hours: 10 },
      { name: 'Custom Hooks & Performance', complete: false, hours: 12 },
    ],
    resources: ['React Official Docs'],
  },
  {
    id: 'nodejs',
    name: 'Node.js',
    description: 'Server-side JavaScript, Event Loop, File System & Package Ecosystem',
    color: '#10b981',
    badgeColor: 'rgba(16, 185, 129, 0.14)',
    progress: 0,
    status: 'locked',
    hoursSpent: 0,
    estimatedHours: 60,
    startDate: null,
    completedDate: null,
    topics: [
      { name: 'Node.js Event Loop Architecture', complete: false, hours: 6 },
      { name: 'Modules & npm Ecosystem', complete: false, hours: 6 },
      { name: 'File System & Streams', complete: false, hours: 8 },
      { name: 'HTTP Servers & Microservices', complete: false, hours: 8 },
    ],
    resources: ['Node.js Official Documentation'],
  },
  {
    id: 'expressjs',
    name: 'Express.js',
    description: 'RESTful API Architecture, Middleware, Auth & Route Controllers',
    color: '#f43f5e',
    badgeColor: 'rgba(244, 63, 94, 0.14)',
    progress: 0,
    status: 'locked',
    hoursSpent: 0,
    estimatedHours: 40,
    startDate: null,
    completedDate: null,
    topics: [
      { name: 'Express Setup & Route Controllers', complete: false, hours: 6 },
      { name: 'Middleware Request Lifecycle', complete: false, hours: 6 },
      { name: 'REST API Design Principles', complete: false, hours: 8 },
      { name: 'JWT Authentication & Security', complete: false, hours: 10 },
    ],
    resources: ['Express.js Guides'],
  },
  {
    id: 'mongodb',
    name: 'MongoDB',
    description: 'NoSQL Database Modeling, Mongoose ODM, Aggregations & Indexing',
    color: '#00e699',
    badgeColor: 'rgba(0, 230, 153, 0.14)',
    progress: 0,
    status: 'locked',
    hoursSpent: 0,
    estimatedHours: 35,
    startDate: null,
    completedDate: null,
    topics: [
      { name: 'MongoDB Atlas & Database Setup', complete: false, hours: 6 },
      { name: 'Mongoose ODM & Schema Modeling', complete: false, hours: 8 },
      { name: 'CRUD Operations & Aggregations', complete: false, hours: 10 },
    ],
    resources: ['MongoDB University', 'Mongoose Docs'],
  },
];

// ── Clean Daily Log Entries (Initial state ready for new sessions) ─────────────

export const logEntries: LogEntry[] = [];

// ── Clean Heatmap Generator ───────────────────────────────────────────────────

export function generateHeatmapData(): HeatmapDay[][] {
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 52 * 7);
  startDate.setDate(startDate.getDate() - startDate.getDay());

  const weeks: HeatmapDay[][] = [];

  for (let w = 0; w < 53; w++) {
    const week: HeatmapDay[] = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + w * 7 + d);
      week.push({ date: new Date(date), hours: 0, intensity: 0 });
    }
    weeks.push(week);
  }

  return weeks;
}

// ── Clean Weekly Chart Data ───────────────────────────────────────────────────

export const weeklyChartData = [
  { day: 'Mon', hours: 0, goal: 3 },
  { day: 'Tue', hours: 0, goal: 3 },
  { day: 'Wed', hours: 0, goal: 3 },
  { day: 'Thu', hours: 0, goal: 3 },
  { day: 'Fri', hours: 0, goal: 3 },
  { day: 'Sat', hours: 0, goal: 3 },
  { day: 'Sun', hours: 0, goal: 3 },
];

// ── Clean Gamification System ─────────────────────────────────────────────────

export const gamification = {
  level: 1,
  levelName: 'Code Initiate',
  xp: 0,
  xpToNext: 1000,
  badges: [
    { id: 'first-log', name: 'First Step', emoji: '🚀', earned: false, xp: 100 },
    { id: 'streak-7', name: '7 Day Streak', emoji: '🔥', earned: false, xp: 200 },
    { id: 'html-master', name: 'HTML Master', emoji: '🌐', earned: false, xp: 300 },
    { id: 'js-explorer', name: 'JS Explorer', emoji: '⚡', earned: false, xp: 400 },
    { id: 'react-padawan', name: 'React Padawan', emoji: '⚛️', earned: false, xp: 500 },
    { id: '100-hours', name: '100 Hour Club', emoji: '💎', earned: false, xp: 600 },
  ],
};

// ── Aria AI Coach Initial Messages ───────────────────────────────────────────

export const hanaMessages = [
  {
    id: 1,
    text: "Welcome to DevTrack, Alex! I'm Aria, your AI Learning Architect. Select your focus module and log your first learning session to start your streak!",
    time: 'Now',
    type: 'greeting' as const,
  },
];

export const hanaQuickSuggestions = [
  "What should I focus on today?",
  "Give me a study plan for this week",
  "Explain HTML & CSS simply",
  "How do I build a daily coding habit?",
  "Challenge me with a concept ⚡",
];

export const weeklyCoachingInsights = [
  {
    label: 'Current focus',
    value: 'HTML & CSS',
    note: 'First module on path',
    color: '#06b6d4',
    emoji: '🌐',
  },
  {
    label: 'Weekly target',
    value: '15.0 hours',
    note: '3.0h / day target',
    color: '#a855f7',
    emoji: '🎯',
  },
  {
    label: 'Level goal',
    value: 'Level 2',
    note: '1,000 XP to level up',
    color: '#ffb800',
    emoji: '✨',
  },
];

// ── Clean Squad Data ──────────────────────────────────────────────────────────

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

export const squadActivity: SquadActivity[] = [];

export const squadMembers: SquadMember[] = [];
