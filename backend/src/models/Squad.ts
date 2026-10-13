import { Schema, model, Document, Types } from 'mongoose';

export interface ISquad extends Document {
  name: string;
  description: string;
  inviteCode: string;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const SquadSchema = new Schema<ISquad>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    inviteCode: { type: String, required: true, unique: true, uppercase: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export const Squad = model<ISquad>('Squad', SquadSchema);
