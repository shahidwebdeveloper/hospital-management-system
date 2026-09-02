import mongoose, { Schema, type InferSchemaType } from "mongoose";

const nurseSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true
    },
    departmentId: {
      type: Schema.Types.ObjectId,
      ref: "Department",
      required: true,
      index: true
    },
    employeeNumber: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true
    },
    department: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
      index: true
    }
  },
  { timestamps: true }
);

nurseSchema.index({ departmentId: 1, status: 1 });
nurseSchema.index({ userId: 1, departmentId: 1 });

export type Nurse = InferSchemaType<typeof nurseSchema>;
export const NurseModel = mongoose.model("Nurse", nurseSchema);
