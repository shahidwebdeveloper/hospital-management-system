import { DoctorModel, type Doctor } from "./doctor-model.js";

type DoctorInput = Omit<Doctor, "createdAt" | "updatedAt"> & {
  availableTime?: string;
};
type DoctorUpdateInput = Partial<DoctorInput>;

export class DoctorService {
  static async createDoctor(data: DoctorInput) {
    return DoctorModel.create(data);
  }

  static async getDoctors(search = "") {
    const normalizedSearch = search.trim();
    const filters = normalizedSearch
      ? {
          $or: [
            { name: { $regex: normalizedSearch, $options: "i" } },
            { email: { $regex: normalizedSearch, $options: "i" } },
            { phone: { $regex: normalizedSearch, $options: "i" } },
            { specialization: { $regex: normalizedSearch, $options: "i" } },
            { department: { $regex: normalizedSearch, $options: "i" } },
            { licenseNumber: { $regex: normalizedSearch, $options: "i" } },
            { status: { $regex: normalizedSearch, $options: "i" } }
          ]
        }
      : {};

    return DoctorModel.find(filters).sort({ createdAt: -1 });
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