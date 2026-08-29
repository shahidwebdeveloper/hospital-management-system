import { DoctorModel, type Doctor } from "./doctor-model.js";
import { User } from "../user/user-model.js";

type DoctorInput = Omit<Doctor, "createdAt" | "updatedAt" | "userId"> & { availableTime?: string; userId?: string };
type DoctorUpdateInput = Partial<DoctorInput>;

export class DoctorService {
  static async createDoctor(data: DoctorInput) {
    const doctor = await DoctorModel.create(data);
    if (doctor.userId) await User.findByIdAndUpdate(doctor.userId, { doctorProfile: doctor._id });
    return doctor;
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
    const doctor = await DoctorModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true
    });
    if (doctor?.userId) await User.findByIdAndUpdate(doctor.userId, { doctorProfile: doctor._id });
    return doctor;
  }

  static async deleteDoctor(id: string) {
    return DoctorModel.findByIdAndDelete(id);
  }
}
