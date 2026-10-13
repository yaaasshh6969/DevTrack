import { Schema, model, Document } from 'mongoose';

export interface IBadge extends Document {
  badgeId: string;
  name: string;
  description: string;
  emoji: string;
  xp: number;
  requirementType: string;
  requirementValue: number;
  createdAt: Date;
  updatedAt: Date;
}

const BadgeSchema = new Schema<IBadge>(
  {
    badgeId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, default: '' },
    emoji: { type: String, required: true },
    xp: { type: Number, required: true, default: 100 },
    requirementType: { type: String, default: 'streak' },
    requirementValue: { type: Number, default: 1 },
  },
  { timestamps: true }
);

export const Badge = model<IBadge>('Badge', BadgeSchema);
