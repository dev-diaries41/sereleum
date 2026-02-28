import mongoose from 'mongoose';
import { User } from '@/app/types';

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  hashedPassword: { type: String, required: true },
  salt: { type: String, required: true },
  name: { type: String },
  username: { type: String },
  credits: { type: Number, default: 0 },
  metadata: {
    creationDate: { type: Date, default: Date.now },
    answers: { type: mongoose.Schema.Types.Mixed },
    hasCompletedOnboarding: { type: Boolean, default: false },
  }         
}, {
toJSON: {
  transform: (doc, ret: Record<string, any>) => {
    ret.id = ret._id.toString();
    delete ret._id;
    return ret;
  }
},
toObject: {
  transform: (doc, ret: Record<string, any>) => {
    ret.id = ret._id.toString();
    delete ret._id;
    return ret;
  }
}
});

export default mongoose.models.User || mongoose.model<User>("User", UserSchema);
