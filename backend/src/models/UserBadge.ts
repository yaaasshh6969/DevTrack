import { Schema, model, Document, Types } from 'mongoose';

export interface IUserBadge extends Document {
  user: Types.ObjectId;
  badge: Types.ObjectId;
  earnedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserBadgeSchema = new Schema<IUserBadge>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    badge: { type: Schema.Types.ObjectId, ref: 'Badge', required: true, index: true },
    earnedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

UserBadgeSchema.index({ user: 1, badge: 1 }, { unique: true });

export const UserBadge = model<IUserBadge>('UserBadge', UserBadgeSchema);
