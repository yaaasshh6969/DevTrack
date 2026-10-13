import { Schema, model, Document, Types } from 'mongoose';

export interface ISquadMember extends Document {
  squad: Types.ObjectId;
  user: Types.ObjectId;
  role: string;
  streak: number;
  weeklyHours: number;
  isOnline: boolean;
  color: string;
  joinedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SquadMemberSchema = new Schema<ISquadMember>(
  {
    squad: { type: Schema.Types.ObjectId, ref: 'Squad', required: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    role: { type: String, default: 'Member' },
    streak: { type: Number, default: 0 },
    weeklyHours: { type: Number, default: 0 },
    isOnline: { type: Boolean, default: false },
    color: { type: String, default: '#8b47f3' },
    joinedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

SquadMemberSchema.index({ squad: 1, user: 1 }, { unique: true });

export const SquadMember = model<ISquadMember>('SquadMember', SquadMemberSchema);
