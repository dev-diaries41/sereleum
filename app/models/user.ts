import mongoose from 'mongoose';
import { User } from '@/app/types';
import { FREE_CREDITS } from '../constants/global';

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  hashedPassword: { type: String, required: true },
  salt: { type: String, required: true },
  name: { type: String },
  username: { type: String },
  credits: { type: Number, default: 0 },
  metadata: {
    creationDate: { type: Date, default: Date.now },
  }         
}, {
  toJSON: {
    transform: (doc, ret) => {
      ret._id = ret._id.toString(); // Convert _id to string in JSON output
      return ret;
    }
  },
  toObject: {
    transform: (doc, ret) => {
      ret._id = ret._id.toString(); // Convert _id to string in object output
      return ret;
    }
  }
});

export default mongoose.models.User || mongoose.model<User>("User", UserSchema);
