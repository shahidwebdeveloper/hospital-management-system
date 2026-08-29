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
  authUserId: string;

  name: string;
  email: string;
  phone?: string;

  role: UserRole;

  isActive: boolean;
  isVerified: boolean;
  patientProfile?: Schema.Types.ObjectId;
  doctorProfile?: Schema.Types.ObjectId;
  nurseProfile?: Schema.Types.ObjectId;
  createdBy?: Schema.Types.ObjectId;
  updatedBy?: Schema.Types.ObjectId;
  deactivatedBy?: Schema.Types.ObjectId;
  deactivatedAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    authUserId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },

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

    phone: {
      type: String,
      trim: true
    },

    role: {
      type: String,
      enum: userRoles,
      default: "patient",
      required: true
    },

    isActive: {
      type: Boolean,
      default: true
    },

    isVerified: {
      type: Boolean,
      default: false
    },
    patientProfile: { type: Schema.Types.ObjectId, ref: "Patient", unique: true, sparse: true },
    doctorProfile: { type: Schema.Types.ObjectId, ref: "Doctor", unique: true, sparse: true },
    nurseProfile: { type: Schema.Types.ObjectId, ref: "Nurse", unique: true, sparse: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    deactivatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    deactivatedAt: { type: Date }
  },
  {
    timestamps: true
  }
);

export const User = model<IUser>("User", userSchema);
