import mongoose, { Schema, type InferSchemaType } from "mongoose";

const appointmentSchema = new Schema(
  {
    patientId: {
      type: String,
      required: true,
      trim: true
    },
    doctorId: {
      type: String,
      required: true,
      trim: true
    },
    appointmentDate: {
      type: Date,
      required: true
    },
    reason: {
      type: String,
      trim: true,
      default: "General consultation"
    },
    status: {
      type: String,
      enum: ["scheduled", "checked_in", "in_progress", "completed", "cancelled", "no_show"],
      default: "scheduled",
      required: true
    }
  },
  {
    timestamps: true
  }
);

export type Appointment = InferSchemaType<typeof appointmentSchema>;

export const AppointmentModel = mongoose.model("Appointment", appointmentSchema);
