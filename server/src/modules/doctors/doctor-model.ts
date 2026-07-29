import mongoose, { Schema, type InferSchemaType } from "mongoose";

const doctorSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    specialization: {
      type: String,
      required: true,
      trim: true
    },
    department: {
      type: String,
      required: true,
      trim: true
    },
    licenseNumber: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    availableDays: {
      type: [String],
      default: []
    },
    availableTime: {
      type: String,
      default: "09:00-17:00"
    },
    status: {
      type: String,
      enum: ["available", "busy", "off_duty", "inactive"],
      default: "available",
      required: true
    }
  },
  {
    timestamps: true
  }
);

export type Doctor = InferSchemaType<typeof doctorSchema>;

export const DoctorModel = mongoose.model("Doctor", doctorSchema);
