import { Schema, model, Document, Types } from 'mongoose';

export interface IRoadmapModule extends Document {
  roadmap: Types.ObjectId;
  slug: string;
  name: string;
  description: string;
  color: string;
  badgeColor: string;
  progress: number;
  status: 'complete' | 'in-progress' | 'locked';
  hoursSpent: number;
  estimatedHours: number;
  startDate?: Date;
  completedDate?: Date;
  currentFocus?: string;
  resources: string[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const RoadmapModuleSchema = new Schema<IRoadmapModule>(
  {
    roadmap: { type: Schema.Types.ObjectId, ref: 'Roadmap', required: true, index: true },
    slug: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    color: { type: String, required: true, default: '#8b47f3' },
    badgeColor: { type: String, default: 'rgba(139,71,243,0.12)' },
    progress: { type: Number, default: 0 },
    status: { type: String, enum: ['complete', 'in-progress', 'locked'], default: 'locked' },
    hoursSpent: { type: Number, default: 0 },
    estimatedHours: { type: Number, required: true },
    startDate: { type: Date },
    completedDate: { type: Date },
    currentFocus: { type: String },
    resources: [{ type: String }],
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const RoadmapModule = model<IRoadmapModule>('RoadmapModule', RoadmapModuleSchema);
