import mongoose, { Schema, type InferSchemaType } from "mongoose";

const departmentSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true
    },
    code: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      uppercase: true,
      index: true
    },
    description: {
      type: String,
      trim: true,
      default: ""
    },
    location: {
      type: String,
      trim: true,
      default: ""
    },
    headDoctorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true
    },
    headNurseId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
      index: true
    }
  },
  {
    timestamps: true
  }
);

departmentSchema.index({ status: 1, name: 1 });

export type Department = InferSchemaType<typeof departmentSchema>;
export const DepartmentModel = mongoose.model("Department", departmentSchema);
