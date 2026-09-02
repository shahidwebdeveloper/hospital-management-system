import { Types } from "mongoose";

import { MedicalRecordModel, type MedicalRecord } from "./medical-record-model.js";

type MedicalRecordInput = Omit<
  MedicalRecord,
  "createdAt" | "updatedAt" | "patientId" | "appointmentId" | "doctorId"
> & {
  patientId: string | Types.ObjectId;
  appointmentId?: string | Types.ObjectId;
  doctorId: string | Types.ObjectId;
};
type MedicalRecordUpdateInput = Partial<MedicalRecordInput>;

function asObjectId(value: string | Types.ObjectId | undefined) {
  if (!value) return undefined;
  return Types.ObjectId.isValid(value) ? new Types.ObjectId(value) : undefined;
}

export class MedicalRecordService {
  static canUpdateRecord({
    status,
    isAdmin,
    isOwner
  }: {
    status: string;
    isAdmin: boolean;
    isOwner: boolean;
  }) {
    if (status === "finalized") {
      return isAdmin;
    }

    return isOwner || isAdmin;
  }

  static async createMedicalRecord(data: MedicalRecordInput) {
    const payload = {
      ...data,
      patientId: asObjectId(String(data.patientId)) ?? data.patientId,
      appointmentId: data.appointmentId
        ? (asObjectId(String(data.appointmentId)) ?? data.appointmentId)
        : undefined,
      doctorId: asObjectId(String(data.doctorId)) ?? data.doctorId
    };
    return MedicalRecordModel.create(payload);
  }

  static async getMedicalRecords(scope: Record<string, unknown> = {}) {
    return MedicalRecordModel.find(scope).sort({ createdAt: -1 });
  }

  static async getMedicalRecordById(id: string) {
    return MedicalRecordModel.findById(id);
  }

  static async updateMedicalRecord(id: string, data: MedicalRecordUpdateInput) {
    const payload = { ...data };
    if (payload.patientId)
      payload.patientId = asObjectId(String(payload.patientId)) ?? payload.patientId;
    if (payload.appointmentId)
      payload.appointmentId = asObjectId(String(payload.appointmentId)) ?? payload.appointmentId;
    if (payload.doctorId)
      payload.doctorId = asObjectId(String(payload.doctorId)) ?? payload.doctorId;

    return MedicalRecordModel.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true
    });
  }

  static async deleteMedicalRecord(id: string) {
    return MedicalRecordModel.findByIdAndDelete(id);
  }
}
