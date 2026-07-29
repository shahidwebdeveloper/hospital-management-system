import type { Request, Response, NextFunction } from "express";

import { LaboratoryService } from "./laboratory-service.js";
import {
  createLaboratorySchema,
  updateLaboratoryStatusSchema,
  laboratoryResultSchema
} from "./laboratory-validation.js";

export class LaboratoryController {
  static async createRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createLaboratorySchema.parse(req.body);

      const laboratory = await LaboratoryService.createLaboratoryRequest(data);

      res.status(201).json({
        success: true,
        message: "Laboratory request created successfully.",
        data: laboratory
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAllRequests(req: Request, res: Response, next: NextFunction) {
    try {
      const laboratories = await LaboratoryService.getAllRequests();

      res.status(200).json({
        success: true,
        data: laboratories
      });
    } catch (error) {
      next(error);
    }
  }

  static async getQueue(req: Request, res: Response, next: NextFunction) {
    try {
      const queue = await LaboratoryService.getQueue();

      res.status(200).json({
        success: true,
        data: queue
      });
    } catch (error) {
      next(error);
    }
  }

  static async getRequestById(req: Request, res: Response, next: NextFunction) {
    try {
      const laboratory = await LaboratoryService.getRequestById(req.params.id);

      if (!laboratory) {
        return res.status(404).json({
          success: false,
          message: "Laboratory request not found."
        });
      }

      res.status(200).json({
        success: true,
        data: laboratory
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const data = updateLaboratoryStatusSchema.parse(req.body);

      const laboratory = await LaboratoryService.updateStatus(req.params.id, data);

      if (!laboratory) {
        return res.status(404).json({
          success: false,
          message: "Laboratory request not found."
        });
      }

      res.status(200).json({
        success: true,
        message: "Laboratory status updated successfully.",
        data: laboratory
      });
    } catch (error) {
      next(error);
    }
  }

  static async enterResult(req: Request, res: Response, next: NextFunction) {
    try {
      const data = laboratoryResultSchema.parse(req.body);

      const laboratory = await LaboratoryService.enterResult(req.params.id, data);

      if (!laboratory) {
        return res.status(404).json({
          success: false,
          message: "Laboratory request not found."
        });
      }

      res.status(200).json({
        success: true,
        message: "Laboratory result saved successfully.",
        data: laboratory
      });
    } catch (error) {
      next(error);
    }
  }

  static async cancelRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const laboratory = await LaboratoryService.cancelRequest(req.params.id);

      if (!laboratory) {
        return res.status(404).json({
          success: false,
          message: "Laboratory request not found."
        });
      }

      res.status(200).json({
        success: true,
        message: "Laboratory request cancelled successfully.",
        data: laboratory
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const laboratory = await LaboratoryService.deleteRequest(req.params.id);

      if (!laboratory) {
        return res.status(404).json({
          success: false,
          message: "Laboratory request not found."
        });
      }

      res.status(200).json({
        success: true,
        message: "Laboratory request deleted successfully."
      });
    } catch (error) {
      next(error);
    }
  }
}
