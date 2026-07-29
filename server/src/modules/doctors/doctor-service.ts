import { DoctorModel, type Doctor } from "./doctor-model.js";

type DoctorInput = Omit<Doctor, "createdAt" | "updatedAt"> & {
  availableTime?: string;
};
type DoctorUpdateInput = Partial<DoctorInput>;

export class DoctorService {
  static async createDoctor(data: DoctorInput) {
    return DoctorModel.create(data);
  }

  static async getDoctors() {
    return DoctorModel.find().sort({ createdAt: -1 });
  }

  static async getDoctorById(id: string) {
    return DoctorModel.findById(id);
  }

  static async updateDoctor(id: string, data: DoctorUpdateInput) {
    return DoctorModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true
    });
  }

  static async deleteDoctor(id: string) {
    return DoctorModel.findByIdAndDelete(id);
  }
}
