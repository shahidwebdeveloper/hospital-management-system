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
  static hasSchedulingConflict({
    doctorId,
    appointmentDate,
    existingStart,
    existingEnd
  }: {
    doctorId: string;
    appointmentDate: Date;
    existingStart: Date;
    existingEnd: Date;
  }) {
    if (!doctorId || !appointmentDate || !existingStart || !existingEnd) {
      return false;
    }

    const candidate = new Date(appointmentDate).getTime();
    const start = new Date(existingStart).getTime();
    const end = new Date(existingEnd).getTime();

    return candidate <= end && candidate >= start;
  }

  static async createAppointment(data: AppointmentInput) {
    const payload = {
      ...data,
      patientId: asObjectId(String(data.patientId)) ?? data.patientId,
      doctorId: asObjectId(String(data.doctorId)) ?? data.doctorId
    };

    if (payload.doctorId && payload.appointmentDate) {
      const candidateDate = new Date(payload.appointmentDate);
      const windowStart = new Date(candidateDate.getTime() - 30 * 60 * 1000);
      const windowEnd = new Date(candidateDate.getTime() + 30 * 60 * 1000);
      const conflict = await AppointmentModel.findOne({
        doctorId: payload.doctorId,
        appointmentDate: {
          $gte: windowStart,
          $lte: windowEnd
        },
        status: { $nin: ["cancelled", "no_show"] }
      });

      if (conflict) {
        throw new Error("Doctor is already booked for this time slot.");
      }
    }

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

    if (payload.doctorId && payload.appointmentDate) {
      const candidateDate = new Date(payload.appointmentDate);
      const windowStart = new Date(candidateDate.getTime() - 30 * 60 * 1000);
      const windowEnd = new Date(candidateDate.getTime() + 30 * 60 * 1000);
      const conflict = await AppointmentModel.findOne({
        _id: { $ne: id },
        doctorId: payload.doctorId,
        appointmentDate: {
          $gte: windowStart,
          $lte: windowEnd
        },
        status: { $nin: ["cancelled", "no_show"] }
      });

      if (conflict) {
        throw new Error("Doctor is already booked for this time slot.");
      }
    }

    return AppointmentModel.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true
    });
  }

  static async deleteAppointment(id: string) {
    return AppointmentModel.findByIdAndDelete(id);
  }
}
