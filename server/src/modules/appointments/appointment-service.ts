import { Types } from "mongoose";

import { AppointmentModel, type Appointment } from "./appointment-model.js";

type AppointmentInput = Omit<Appointment, "createdAt" | "updatedAt" | "patientId" | "doctorId"> & {
  patientId: string | Types.ObjectId;
  doctorId: string | Types.ObjectId;
};
type AppointmentUpdateInput = Partial<AppointmentInput>;

function asObjectId(value: string | Types.ObjectId | undefined) {
  if (!value) return undefined;
  return Types.ObjectId.isValid(value) ? new Types.ObjectId(value) : undefined;
}

export class AppointmentService {
  static async createAppointment(data: AppointmentInput) {
    const payload = {
      ...data,
      patientId: asObjectId(String(data.patientId)) ?? data.patientId,
      doctorId: asObjectId(String(data.doctorId)) ?? data.doctorId
    };
    return AppointmentModel.create(payload);
  }

  static async getAppointments(scope: Record<string, unknown> = {}) {
    return AppointmentModel.find(scope).sort({ appointmentDate: 1 });
  }

  static async getAppointmentById(id: string) {
    return AppointmentModel.findById(id);
  }

  static async updateAppointment(id: string, data: AppointmentUpdateInput) {
    const payload = { ...data };
    if (payload.patientId)
      payload.patientId = asObjectId(String(payload.patientId)) ?? payload.patientId;
    if (payload.doctorId)
      payload.doctorId = asObjectId(String(payload.doctorId)) ?? payload.doctorId;

    return AppointmentModel.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true
    });
  }

  static async deleteAppointment(id: string) {
    return AppointmentModel.findByIdAndDelete(id);
  }
}
