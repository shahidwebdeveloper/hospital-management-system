import mongoose, { Schema, type InferSchemaType } from "mongoose";

const appointmentSchema = new Schema(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
      index: true
    },
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    appointmentDate: {
      type: Date,
      required: true,
      index: true
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
      required: true,
      index: true
    }
  },
  {
    timestamps: true
  }
);

appointmentSchema.index({ patientId: 1, appointmentDate: -1 });
appointmentSchema.index({ doctorId: 1, status: 1, appointmentDate: -1 });
appointmentSchema.index({ status: 1, appointmentDate: 1 });

export type Appointment = InferSchemaType<typeof appointmentSchema>;

export const AppointmentModel = mongoose.model("Appointment", appointmentSchema);
