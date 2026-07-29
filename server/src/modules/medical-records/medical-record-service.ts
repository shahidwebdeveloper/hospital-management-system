import { MedicalRecordModel, type MedicalRecord } from "./medical-record-model.js";

type MedicalRecordInput = Omit<MedicalRecord, "createdAt" | "updatedAt">;
type MedicalRecordUpdateInput = Partial<MedicalRecordInput>;

export class MedicalRecordService {
  static async createMedicalRecord(data: MedicalRecordInput) {
    return MedicalRecordModel.create(data);
  }

  static async getMedicalRecords() {
    return MedicalRecordModel.find().sort({ createdAt: -1 });
  }

  static async getMedicalRecordById(id: string) {
    return MedicalRecordModel.findById(id);
  }

  static async updateMedicalRecord(id: string, data: MedicalRecordUpdateInput) {
    return MedicalRecordModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true
    });
  }

  static async deleteMedicalRecord(id: string) {
    return MedicalRecordModel.findByIdAndDelete(id);
  }
}
