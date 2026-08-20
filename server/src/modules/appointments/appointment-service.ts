import { AppointmentModel, type Appointment } from "./appointment-model.js";

type AppointmentInput = Omit<Appointment, "createdAt" | "updatedAt">;
type AppointmentUpdateInput = Partial<AppointmentInput>;

export class AppointmentService {
  static async createAppointment(data: AppointmentInput) {
    return AppointmentModel.create(data);
  }

  static async getAppointments(scope: Record<string, unknown> = {}) {
    return AppointmentModel.find(scope).sort({ appointmentDate: 1 });
  }

  static async getAppointmentById(id: string) {
    return AppointmentModel.findById(id);
  }

  static async updateAppointment(id: string, data: AppointmentUpdateInput) {
    return AppointmentModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true
    });
  }

  static async deleteAppointment(id: string) {
    return AppointmentModel.findByIdAndDelete(id);
  }
}
