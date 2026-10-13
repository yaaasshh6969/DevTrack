import { Schema, model, Document, Types } from 'mongoose';
import { XpSource } from '../utils/xp';

export interface IXpEvent extends Document {
  user: Types.ObjectId;
  source: XpSource;
  sourceKey: string;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
}

const XpEventSchema = new Schema<IXpEvent>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    source: {
      type: String,
      required: true,
      enum: ['log_hours', 'topic', 'daily_goal', 'streak_7'],
    },
    sourceKey: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

XpEventSchema.index({ user: 1, source: 1, sourceKey: 1 }, { unique: true });

export const XpEvent = model<IXpEvent>('XpEvent', XpEventSchema);
