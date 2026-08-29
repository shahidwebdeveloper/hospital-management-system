import mongoose, { Schema, type InferSchemaType } from "mongoose";

const nurseSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true, index: true },
    employeeNumber: { type: String, required: true, trim: true, unique: true },
    department: { type: String, required: true, trim: true },
    status: { type: String, enum: ["active", "inactive"], default: "active" }
  },
  { timestamps: true }
);

export type Nurse = InferSchemaType<typeof nurseSchema>;
export const NurseModel = mongoose.model("Nurse", nurseSchema);
