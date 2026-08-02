import type { Request, Response, NextFunction } from "express";

import { PharmacyService } from "./pharmacy-service.js";
import {
  createMedicineSchema,
  updateMedicineSchema,
  medicineIdSchema
} from "./pharmacy-validation.js";

export class PharmacyController {
  static async createMedicine(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createMedicineSchema.parse(req.body);
      const medicine = await PharmacyService.createMedicine(data);

      res
        .status(201)
        .json({ success: true, message: "Medicine created successfully.", data: medicine });
    } catch (error) {
      next(error);
    }
  }

  static async getAllMedicines(req: Request, res: Response, next: NextFunction) {
    try {
      const medicines = await PharmacyService.getAllMedicines();
      res.status(200).json({ success: true, data: medicines });
    } catch (error) {
      next(error);
    }
  }

  static async getMedicineById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = medicineIdSchema.parse({ params: req.params }).params.id;
      const medicine = await PharmacyService.getMedicineById(id);

      if (!medicine) {
        return res.status(404).json({ success: false, message: "Medicine not found." });
      }

      res.status(200).json({ success: true, data: medicine });
    } catch (error) {
      next(error);
    }
  }

  static async updateMedicine(req: Request, res: Response, next: NextFunction) {
    try {
      const id = medicineIdSchema.parse({ params: req.params }).params.id;
      const data = updateMedicineSchema.parse(req.body);
      const medicine = await PharmacyService.updateMedicine(id, data);

      if (!medicine) {
        return res.status(404).json({ success: false, message: "Medicine not found." });
      }

      res
        .status(200)
        .json({ success: true, message: "Medicine updated successfully.", data: medicine });
    } catch (error) {
      next(error);
    }
  }

  static async deleteMedicine(req: Request, res: Response, next: NextFunction) {
    try {
      const id = medicineIdSchema.parse({ params: req.params }).params.id;
      const medicine = await PharmacyService.deleteMedicine(id);

      if (!medicine) {
        return res.status(404).json({ success: false, message: "Medicine not found." });
      }

      res.status(200).json({ success: true, message: "Medicine deleted successfully." });
    } catch (error) {
      next(error);
    }
  }
}
