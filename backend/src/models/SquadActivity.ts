import { Schema, model, Document, Types } from 'mongoose';

export interface ISquadActivity extends Document {
  squad: Types.ObjectId;
  user: Types.ObjectId;
  memberName: string;
  initials: string;
  color: string;
  action: string;
  topic: string;
  hours?: number;
  type: 'session' | 'streak' | 'milestone' | 'badge';
  createdAt: Date;
  updatedAt: Date;
}

const SquadActivitySchema = new Schema<ISquadActivity>(
  {
    squad: { type: Schema.Types.ObjectId, ref: 'Squad', required: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    memberName: { type: String, required: true },
    initials: { type: String, required: true },
    color: { type: String, default: '#8b47f3' },
    action: { type: String, required: true },
    topic: { type: String, default: '' },
    hours: { type: Number },
    type: { type: String, enum: ['session', 'streak', 'milestone', 'badge'], required: true },
  },
  { timestamps: true }
);

export const SquadActivity = model<ISquadActivity>('SquadActivity', SquadActivitySchema);
