import { Schema, model, Document, Types } from 'mongoose';

export interface IRoadmap extends Document {
  user: Types.ObjectId;
  title: string;
  description: string;
  totalProgress: number;
  completedStages: number;
  totalStages: number;
  totalHoursSpent: number;
  totalEstimatedHours: number;
  createdAt: Date;
  updatedAt: Date;
}

const RoadmapSchema = new Schema<IRoadmap>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, default: 'Full-Stack Developer Path' },
    description: { type: String, default: 'HTML → CSS → JS → React → Node.js → Express → MongoDB' },
    totalProgress: { type: Number, default: 0 },
    completedStages: { type: Number, default: 0 },
    totalStages: { type: Number, default: 6 },
    totalHoursSpent: { type: Number, default: 0 },
    totalEstimatedHours: { type: Number, default: 350 },
  },
  { timestamps: true }
);

export const Roadmap = model<IRoadmap>('Roadmap', RoadmapSchema);
