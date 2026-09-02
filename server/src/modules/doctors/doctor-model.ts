import mongoose, { Schema, type InferSchemaType } from "mongoose";

const doctorSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      sparse: true,
      index: true
    },
    departmentId: {
      type: Schema.Types.ObjectId,
      ref: "Department",
      index: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      sparse: true,
      index: true
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true
    },
    specialization: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    department: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    licenseNumber: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true
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
      required: true,
      index: true
    }
  },
  {
    timestamps: true
  }
);

doctorSchema.index({ departmentId: 1, status: 1, availability: 1 });

doctorSchema.index({ userId: 1, departmentId: 1 });

export type Doctor = InferSchemaType<typeof doctorSchema>;

export const DoctorModel = mongoose.model("Doctor", doctorSchema);
