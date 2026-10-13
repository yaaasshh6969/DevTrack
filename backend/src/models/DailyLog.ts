import { Schema, model, Document, Types } from 'mongoose';

export interface IDailyLog extends Document {
  user: Types.ObjectId;
  moduleRef?: Types.ObjectId;
  date: Date;
  topic: string;
  subtopic: string;
  module: string;
  moduleColor: string;
  hours: number;
  notes: string;
  resources: string[];
  tags: string[];
  mood: number;
  createdAt: Date;
  updatedAt: Date;
}

const DailyLogSchema = new Schema<IDailyLog>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    moduleRef: { type: Schema.Types.ObjectId, ref: 'RoadmapModule' },
    date: { type: Date, required: true, default: Date.now, index: true },
    topic: { type: String, required: true, trim: true },
    subtopic: { type: String, default: '', trim: true },
    module: { type: String, required: true },
    moduleColor: { type: String, default: '#8b47f3' },
    hours: { type: Number, required: true, min: 0.1 },
    notes: { type: String, default: '' },
    resources: [{ type: String }],
    tags: [{ type: String }],
    mood: { type: Number, min: 1, max: 5, default: 4 },
  },
  { timestamps: true }
);

export const DailyLog = model<IDailyLog>('DailyLog', DailyLogSchema);
