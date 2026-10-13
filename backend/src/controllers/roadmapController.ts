import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { Roadmap } from '../models/Roadmap';
import { RoadmapModule } from '../models/RoadmapModule';
import { RoadmapTopic } from '../models/RoadmapTopic';
import { User } from '../models/User';
import { reconcileUserGamification } from '../services/gamificationService';

// ── Default Full-Stack roadmap seed data ──────────────────────────────────────

const DEFAULT_MODULES = [
  {
    slug: 'html-css',
    name: 'HTML & CSS',
    description: 'Semantic HTML5, CSS Grid, Flexbox, Animations & Responsive Design',
    color: '#06b6d4',
    badgeColor: 'rgba(6, 182, 212, 0.14)',
    estimatedHours: 45,
    order: 0,
    status: 'in-progress' as const,
    currentFocus: 'Semantic HTML5 & Modern Layouts',
    resources: ['MDN Web Docs', 'CSS Tricks'],
    topics: [
      { name: 'Semantic HTML5 Elements', hours: 4, order: 0 },
      { name: 'CSS Fundamentals & Box Model', hours: 6, order: 1 },
      { name: 'Flexbox Layout System', hours: 8, order: 2 },
      { name: 'CSS Grid System', hours: 8, order: 3 },
      { name: 'Responsive Design & Media Queries', hours: 7, order: 4 },
      { name: 'CSS Custom Properties & Animations', hours: 6, order: 5 },
    ],
  },
  {
    slug: 'javascript',
    name: 'JavaScript',
    description: 'Core ES6+, Async/Await, DOM, Closures, Data Structures & Modules',
    color: '#ffb800',
    badgeColor: 'rgba(255, 184, 0, 0.14)',
    estimatedHours: 85,
    order: 1,
    status: 'locked' as const,
    resources: ["javascript.info", "You Don't Know JS"],
    topics: [
      { name: 'Variables, Scope & Closures', hours: 8, order: 0 },
      { name: 'Arrays & Objects Deep Dive', hours: 9, order: 1 },
      { name: 'DOM Manipulation & Events', hours: 10, order: 2 },
      { name: 'Async JS, Promises & Fetch API', hours: 10, order: 3 },
      { name: 'ES6+ Modules & Architecture', hours: 10, order: 4 },
    ],
  },
  {
    slug: 'react',
    name: 'React',
    description: 'Components, Custom Hooks, State Management, Router & Performance',
    color: '#a855f7',
    badgeColor: 'rgba(168, 85, 247, 0.14)',
    estimatedHours: 85,
    order: 2,
    status: 'locked' as const,
    resources: ['React Official Docs'],
    topics: [
      { name: 'JSX & Component Fundamentals', hours: 8, order: 0 },
      { name: 'useState & useEffect Hooks', hours: 8, order: 1 },
      { name: 'Context API & State Management', hours: 10, order: 2 },
      { name: 'React Router v6', hours: 10, order: 3 },
      { name: 'Custom Hooks & Performance', hours: 12, order: 4 },
    ],
  },
  {
    slug: 'nodejs',
    name: 'Node.js',
    description: 'Server-side JavaScript, Event Loop, File System & Package Ecosystem',
    color: '#10b981',
    badgeColor: 'rgba(16, 185, 129, 0.14)',
    estimatedHours: 60,
    order: 3,
    status: 'locked' as const,
    resources: ['Node.js Official Documentation'],
    topics: [
      { name: 'Node.js Event Loop Architecture', hours: 6, order: 0 },
      { name: 'Modules & npm Ecosystem', hours: 6, order: 1 },
      { name: 'File System & Streams', hours: 8, order: 2 },
      { name: 'HTTP Servers & Microservices', hours: 8, order: 3 },
    ],
  },
  {
    slug: 'expressjs',
    name: 'Express.js',
    description: 'RESTful API Architecture, Middleware, Auth & Route Controllers',
    color: '#f43f5e',
    badgeColor: 'rgba(244, 63, 94, 0.14)',
    estimatedHours: 40,
    order: 4,
    status: 'locked' as const,
    resources: ['Express.js Guides'],
    topics: [
      { name: 'Express Setup & Route Controllers', hours: 6, order: 0 },
      { name: 'Middleware Request Lifecycle', hours: 6, order: 1 },
      { name: 'REST API Design Principles', hours: 8, order: 2 },
      { name: 'JWT Authentication & Security', hours: 10, order: 3 },
    ],
  },
  {
    slug: 'mongodb',
    name: 'MongoDB',
    description: 'NoSQL Database Modeling, Mongoose ODM, Aggregations & Indexing',
    color: '#00e699',
    badgeColor: 'rgba(0, 230, 153, 0.14)',
    estimatedHours: 35,
    order: 5,
    status: 'locked' as const,
    resources: ['MongoDB University', 'Mongoose Docs'],
    topics: [
      { name: 'MongoDB Atlas & Database Setup', hours: 6, order: 0 },
      { name: 'Mongoose ODM & Schema Modeling', hours: 8, order: 1 },
      { name: 'CRUD Operations & Aggregations', hours: 10, order: 2 },
    ],
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

async function recalculateModuleProgress(moduleId: string): Promise<void> {
  const topics = await RoadmapTopic.find({ module: moduleId });
  const total = topics.length;
  const completed = topics.filter((t) => t.complete).length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  let status: 'complete' | 'in-progress' | 'locked' = 'in-progress';
  if (progress === 100 && total > 0) status = 'complete';
  // locked status is only set at creation; once unlocked, keep in-progress/complete

  await RoadmapModule.findByIdAndUpdate(moduleId, { progress, status: status });
}

async function recalculateRoadmapProgress(roadmapId: string): Promise<void> {
  const modules = await RoadmapModule.find({ roadmap: roadmapId });
  const unlocked = modules.filter((m) => m.status !== 'locked');
  const total = unlocked.length;
  const completed = unlocked.filter((m) => m.status === 'complete').length;
  const totalProgress = total > 0 ? Math.round((completed / total) * 100) : 0;

  await Roadmap.findByIdAndUpdate(roadmapId, {
    totalProgress,
    completedStages: completed,
    totalStages: modules.length,
  });

  // Update user's roadmapCompletion cache
  const roadmap = await Roadmap.findById(roadmapId);
  if (roadmap) {
    await User.findByIdAndUpdate(roadmap.user, { roadmapCompletion: totalProgress });
  }
}

async function seedDefaultRoadmap(userId: string) {
  const roadmap = await Roadmap.create({
    user: userId,
    title: 'Full-Stack Developer Path',
    description: 'HTML → CSS → JavaScript → React → Node.js → Express → MongoDB',
    totalStages: DEFAULT_MODULES.length,
  });

  for (const modData of DEFAULT_MODULES) {
    const { topics, ...moduleFields } = modData;
    const mod = await RoadmapModule.create({
      roadmap: roadmap._id,
      ...moduleFields,
    });

    for (const topicData of topics) {
      await RoadmapTopic.create({
        module: mod._id,
        ...topicData,
        complete: false,
      });
    }
  }

  return roadmap._id;
}

// ── Controllers ───────────────────────────────────────────────────────────────

export const getRoadmaps = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ success: false, error: { message: 'Unauthorized.' } });
      return;
    }

    let roadmap = await Roadmap.findOne({ user: req.userId });

    // Auto-seed default roadmap for new users
    if (!roadmap) {
      const newId = await seedDefaultRoadmap(req.userId);
      roadmap = await Roadmap.findById(newId);
    }

    // Populate modules and their topics
    const modules = await RoadmapModule.find({ roadmap: roadmap!._id }).sort({ order: 1 });

    const modulesWithTopics = await Promise.all(
      modules.map(async (mod) => {
        const topics = await RoadmapTopic.find({ module: mod._id }).sort({ order: 1 });
        return { ...mod.toObject(), topics };
      })
    );

    res.status(200).json({
      success: true,
      data: { roadmap: { ...roadmap!.toObject(), modules: modulesWithTopics } },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message || 'Failed to fetch roadmap.' } });
  }
};

export const patchTopic = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ success: false, error: { message: 'Unauthorized.' } });
      return;
    }

    const { topicId } = req.params;
    const { complete } = req.body;

    if (typeof complete !== 'boolean') {
      res.status(400).json({ success: false, error: { message: '`complete` must be a boolean.' } });
      return;
    }

    const topic = await RoadmapTopic.findById(topicId);
    if (!topic) {
      res.status(404).json({ success: false, error: { message: 'Topic not found.' } });
      return;
    }

    // Verify ownership via module → roadmap → user chain
    const parentModule = await RoadmapModule.findById(topic.module);
    if (!parentModule) {
      res.status(404).json({ success: false, error: { message: 'Module not found.' } });
      return;
    }

    const roadmap = await Roadmap.findById(parentModule.roadmap);
    if (!roadmap || roadmap.user.toString() !== req.userId) {
      res.status(403).json({ success: false, error: { message: 'Access denied.' } });
      return;
    }

    // Update topic
    topic.complete = complete;
    await topic.save();

    // Recalculate module progress
    await recalculateModuleProgress(parentModule._id.toString());

    // Recalculate overall roadmap progress
    await recalculateRoadmapProgress(roadmap._id.toString());

    await reconcileUserGamification(req.userId);

    // Fetch updated topic, module, and roadmap
    const updatedTopic = await RoadmapTopic.findById(topicId);
    const updatedModule = await RoadmapModule.findById(parentModule._id);
    const updatedRoadmap = await Roadmap.findById(roadmap._id);

    res.status(200).json({
      success: true,
      data: { topic: updatedTopic, module: updatedModule, roadmap: updatedRoadmap },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message || 'Failed to update topic.' } });
  }
};
