import { Schema, model, Document, Types } from 'mongoose';

export interface IRoadmapTopic extends Document {
  module: Types.ObjectId;
  name: string;
  complete: boolean;
  hours?: number;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const RoadmapTopicSchema = new Schema<IRoadmapTopic>(
  {
    module: { type: Schema.Types.ObjectId, ref: 'RoadmapModule', required: true, index: true },
    name: { type: String, required: true },
    complete: { type: Boolean, default: false },
    hours: { type: Number },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const RoadmapTopic = model<IRoadmapTopic>('RoadmapTopic', RoadmapTopicSchema);
