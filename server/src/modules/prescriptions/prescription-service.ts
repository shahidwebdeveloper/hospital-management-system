import { PrescriptionModel } from "./prescription-model.js";

type PrescriptionItemInput = {
  medicineName: string;
  dosage: string;
  duration: string;
  instructions: string;
};

type PrescriptionInput = {
  patientId: string;
  doctorId: string;
  appointmentId?: string;
  items: PrescriptionItemInput[];
  status: "issued" | "dispensed" | "partially_dispensed" | "cancelled";
  notes?: string;
};

type PrescriptionUpdateInput = Partial<PrescriptionInput>;

export class PrescriptionService {
  static canUpdateItems({ status, hasItemsChange }: { status: string; hasItemsChange: boolean }) {
    if (!hasItemsChange) {
      return true;
    }

    return !["issued", "dispensed", "partially_dispensed"].includes(status);
  }

  static async createPrescription(data: PrescriptionInput) {
    return PrescriptionModel.create(data);
  }

  static async getPrescriptions(scope: Record<string, unknown> = {}) {
    return PrescriptionModel.find(scope).sort({ createdAt: -1 });
  }

  static async getPrescriptionById(id: string) {
    return PrescriptionModel.findById(id);
  }

  static async updatePrescription(id: string, data: PrescriptionUpdateInput) {
    return PrescriptionModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true
    });
  }

  static async deletePrescription(id: string) {
    return PrescriptionModel.findByIdAndDelete(id);
  }
}
