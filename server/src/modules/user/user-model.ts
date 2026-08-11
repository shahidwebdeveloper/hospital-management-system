import { Schema, model } from "mongoose";
import type { Document } from "mongoose";

export const userRoles = [
  "super_admin",
  "admin",
  "doctor",
  "nurse",
  "receptionist",
  "pharmacist",
  "lab_technician",
  "patient"
] as const;

export type UserRole = (typeof userRoles)[number];

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: UserRole;
  isActive: boolean;
  isVerified: boolean;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false
    },

    phone: {
      type: String
    },

    role: {
      type: String,
      enum: userRoles,
      default: "patient"
    },

    isActive: {
      type: Boolean,
      default: true
    },

    isVerified: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

export const User = model<IUser>("User", userSchema);
