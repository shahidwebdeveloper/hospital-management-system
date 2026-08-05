import { PatientModel, type Patient } from "./patient-model.js";

type PatientInput = Omit<Patient, "createdAt" | "updatedAt">;

type PatientUpdateInput = Partial<PatientInput>;

export class PatientService {
  /**
   * Create a new patient
   */
  static async createPatient(data: PatientInput) {
    const patient = await PatientModel.create(data);

    return patient;
  }

  /**
   * Get all patients
   */
  static async getPatients(search = "") {
    const normalizedSearch = search.trim();
    const filters = normalizedSearch
      ? {
          $or: [
            { name: { $regex: normalizedSearch, $options: "i" } },
            { phone: { $regex: normalizedSearch, $options: "i" } },
            { email: { $regex: normalizedSearch, $options: "i" } },
            { bloodGroup: { $regex: normalizedSearch, $options: "i" } },
            { status: { $regex: normalizedSearch, $options: "i" } }
          ]
        }
      : {};

    const patients = await PatientModel.find(filters).sort({
      createdAt: -1
    });

    return patients;
  }

  /**
   * Get a patient by ID
   */
  static async getPatientById(id: string) {
    const patient = await PatientModel.findById(id);

    return patient;
  }

  /**
   * Update a patient
   */
  static async updatePatient(id: string, data: PatientUpdateInput) {
    const patient = await PatientModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true
    });

    return patient;
  }

  /**
   * Delete a patient
   */
  static async deletePatient(id: string) {
    const patient = await PatientModel.findByIdAndDelete(id);

    return patient;
  }
}