import type { NextFunction, Request, Response } from "express";

import { PrescriptionService } from "./prescription-service.js";
import { createPrescriptionSchema, updatePrescriptionSchema } from "./prescription-validation.js";

export class PrescriptionController {
  static async createPrescription(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = createPrescriptionSchema.parse(req.validatedBody ?? req.body);
      const prescription = await PrescriptionService.createPrescription({
        ...validatedData,
        items: (validatedData.items ?? []).map((item) => ({
          ...item,
          instructions: item.instructions ?? ""
        }))
      });

      return res
        .status(201)
        .json({ success: true, message: "Prescription created successfully.", data: prescription });
    } catch (error) {
      next(error);
    }
  }

  static async getPrescriptions(_req: Request, res: Response, next: NextFunction) {
    try {
      const prescriptions = await PrescriptionService.getPrescriptions();
      return res.status(200).json({ success: true, data: prescriptions });
    } catch (error) {
      next(error);
    }
  }

  static async getPrescriptionById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id || Array.isArray(id)) {
        return res.status(400).json({ success: false, message: "Invalid prescription id." });
      }

      const prescription = await PrescriptionService.getPrescriptionById(id);
      if (!prescription) {
        return res.status(404).json({ success: false, message: "Prescription not found." });
      }

      return res.status(200).json({ success: true, data: prescription });
    } catch (error) {
      next(error);
    }
  }

  static async updatePrescription(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id || Array.isArray(id)) {
        return res.status(400).json({ success: false, message: "Invalid prescription id." });
      }

      const validatedData = updatePrescriptionSchema.parse(req.validatedBody ?? req.body);
      const prescription = await PrescriptionService.updatePrescription(id, {
        ...validatedData,
        items: validatedData.items?.map((item) => ({
          ...item,
          instructions: item.instructions ?? ""
        }))
      });

      if (!prescription) {
        return res.status(404).json({ success: false, message: "Prescription not found." });
      }

      return res
        .status(200)
        .json({ success: true, message: "Prescription updated successfully.", data: prescription });
    } catch (error) {
      next(error);
    }
  }

  static async deletePrescription(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id || Array.isArray(id)) {
        return res.status(400).json({ success: false, message: "Invalid prescription id." });
      }

      const prescription = await PrescriptionService.deletePrescription(id);
      if (!prescription) {
        return res.status(404).json({ success: false, message: "Prescription not found." });
      }

      return res.status(200).json({ success: true, message: "Prescription deleted successfully." });
    } catch (error) {
      next(error);
    }
  }
}
