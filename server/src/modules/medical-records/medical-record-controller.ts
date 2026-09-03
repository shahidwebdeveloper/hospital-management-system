import type { NextFunction, Request, Response } from "express";

import { MedicalRecordService } from "./medical-record-service.js";
import { resourceScope } from "../../middlewares/authorize-resource.js";
import {
  createMedicalRecordSchema,
  updateMedicalRecordSchema
} from "./medical-record-validation.js";

export class MedicalRecordController {
  static async createMedicalRecord(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = createMedicalRecordSchema.parse(req.validatedBody ?? req.body);
      const record = await MedicalRecordService.createMedicalRecord({
        ...validatedData,
        treatmentPlan: validatedData.treatmentPlan ?? "",
        doctorNotes: validatedData.doctorNotes ?? "",
        nurseNotes: "",
        status: validatedData.status ?? "active"
      });

      return res
        .status(201)
        .json({ success: true, message: "Medical record created successfully.", data: record });
    } catch (error) {
      next(error);
    }
  }

  static async getMedicalRecords(_req: Request, res: Response, next: NextFunction) {
    try {
      const records = await MedicalRecordService.getMedicalRecords(
        await resourceScope("medical-record", _req.user!)
      );
      return res.status(200).json({ success: true, data: records });
    } catch (error) {
      next(error);
    }
  }

  static async getMedicalRecordById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id || Array.isArray(id)) {
        return res.status(400).json({ success: false, message: "Invalid medical record id." });
      }

      const record = await MedicalRecordService.getMedicalRecordById(id);
      if (!record) {
        return res.status(404).json({ success: false, message: "Medical record not found." });
      }

      return res.status(200).json({ success: true, data: record });
    } catch (error) {
      next(error);
    }
  }

  static async updateMedicalRecord(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id || Array.isArray(id)) {
        return res.status(400).json({ success: false, message: "Invalid medical record id." });
      }

      const validatedData = updateMedicalRecordSchema.parse(req.validatedBody ?? req.body);
      const record = await MedicalRecordService.updateMedicalRecord(id, validatedData);

      if (!record) {
        return res.status(404).json({ success: false, message: "Medical record not found." });
      }

      return res
        .status(200)
        .json({ success: true, message: "Medical record updated successfully.", data: record });
    } catch (error) {
      next(error);
    }
  }

  static async deleteMedicalRecord(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id || Array.isArray(id)) {
        return res.status(400).json({ success: false, message: "Invalid medical record id." });
      }

      const record = await MedicalRecordService.deleteMedicalRecord(id);
      if (!record) {
        return res.status(404).json({ success: false, message: "Medical record not found." });
      }

      return res
        .status(200)
        .json({ success: true, message: "Medical record deleted successfully." });
    } catch (error) {
      next(error);
    }
  }
}
