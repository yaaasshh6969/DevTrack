import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  username: string;
  email: string;
  passwordHash?: string;
  avatarUrl?: string;
  bio?: string;
  learningGoal?: string;
  initials: string;
  streak: number;
  longestStreak: number;
  totalHours: number;
  roadmapCompletion: number;
  todayHours: number;
  todayGoal: number;
  weeklyGoal: number;
  joinDate: Date;
  currentModule: string;
  xp: number;
  level: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, trim: true, lowercase: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    passwordHash: { type: String, required: true, select: false },
    avatarUrl: { type: String, default: '' },
    bio: { type: String, default: '' },
    learningGoal: { type: String, default: 'Become a Full-Stack Developer' },
    initials: { type: String, required: true, uppercase: true },
    streak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    totalHours: { type: Number, default: 0 },
    roadmapCompletion: { type: Number, default: 0 },
    todayHours: { type: Number, default: 0 },
    todayGoal: { type: Number, default: 3.0 },
    weeklyGoal: { type: Number, default: 15.0 },
    joinDate: { type: Date, default: Date.now },
    currentModule: { type: String, default: 'HTML & CSS' },
    xp: { type: Number, default: 0, min: 0 },
    level: { type: Number, default: 1, min: 1 },
  },
  { timestamps: true }
);

UserSchema.pre('validate', function () {
  const rawLevel = this.get('level') as unknown;
  if (typeof rawLevel === 'string' || Number.isNaN(Number(rawLevel))) {
    this.level = 1;
  }
  if (typeof this.xp !== 'number' || Number.isNaN(this.xp) || this.xp < 0) {
    this.xp = 0;
  }
});

export const User = model<IUser>('User', UserSchema);
