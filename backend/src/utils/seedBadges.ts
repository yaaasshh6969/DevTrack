import { Badge } from '../models/Badge';

export const DEFAULT_BADGES = [
  {
    badgeId: 'first-step',
    name: 'First Step',
    description: 'Complete your first learning session',
    emoji: '🚀',
    xp: 0,
    requirementType: 'logs',
    requirementValue: 1,
  },
  {
    badgeId: 'hours-10',
    name: '10 Hours',
    description: 'Reach 10 total learning hours',
    emoji: '⏱️',
    xp: 0,
    requirementType: 'hours',
    requirementValue: 10,
  },
  {
    badgeId: 'week-warrior',
    name: 'Week Warrior',
    description: 'Maintain a 7-day learning streak',
    emoji: '🔥',
    xp: 0,
    requirementType: 'streak',
    requirementValue: 7,
  },
  {
    badgeId: 'hours-50',
    name: '50 Hours',
    description: 'Reach 50 total learning hours',
    emoji: '💎',
    xp: 0,
    requirementType: 'hours',
    requirementValue: 50,
  },
  {
    badgeId: 'roadmap-starter',
    name: 'Roadmap Starter',
    description: 'Complete your first roadmap topic',
    emoji: '🗺️',
    xp: 0,
    requirementType: 'topics',
    requirementValue: 1,
  },
  {
    badgeId: 'roadmap-crusher',
    name: 'Roadmap Crusher',
    description: 'Complete 25 roadmap topics',
    emoji: '⚔️',
    xp: 0,
    requirementType: 'topics',
    requirementValue: 25,
  },
];

export async function seedBadges(): Promise<void> {
  for (const badge of DEFAULT_BADGES) {
    await Badge.updateOne({ badgeId: badge.badgeId }, { $set: badge }, { upsert: true });
  }
}
