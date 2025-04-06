import mongoose, { Document, Schema } from 'mongoose';

interface SkinCareRoutine {
  morning: string;
  night: string;
}

interface SkinImage {
  url: string;
  id: string;
}

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  skinImage?: SkinImage;
  skinConcernDescription?: string;
  skinCareRoutine?: SkinCareRoutine;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    skinImage: {
      url: {
        type: String,
        default: '',
      },
      id: {
        type: String,
        default: '',
      },
    },
    skinConcernDescription: {
      type: String,
      default: '',
    },
    skinCareRoutine: {
      morning: {
        type: String,
        default: '',
      },
      night: {
        type: String,
        default: '',
      },
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model<IUser>('User', userSchema);

export default User;
