import type { NextFunction, Request, Response } from "express";

import type { Patient } from "./patient-model.js";

import { PatientService } from "./patient-service.js";

import { createPatientSchema, updatePatientSchema } from "./patient-validation.js";

export class PatientController {
  /**
   * Create Patient
   */
  static async createPatient(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = createPatientSchema.parse(req.validatedBody ?? req.body);

      const patient = await PatientService.createPatient(validatedData);

      return res.status(201).json({
        success: true,

        message: "Patient created successfully.",

        data: patient
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get All Patients
   */
  static async getPatients(req: Request, res: Response, next: NextFunction) {
    try {
      const search = typeof req.query.search === "string" ? req.query.search : "";
      const patients = await PatientService.getPatients(search);

      return res.status(200).json({
        success: true,

        data: patients
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get Current Patient Profile
   */
  static async getCurrentPatient(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({
          success: false,

          message: "Unauthorized."
        });
      }

      const patient = await PatientService.getPatientByUserId(req.user.id);

      if (!patient) {
        return res.status(404).json({
          success: false,

          message: "Patient profile not found for this account."
        });
      }

      return res.status(200).json({
        success: true,

        data: patient
      });
    } catch (error) {
      next(error);
    }
  }
  /**
   * Get Patient By ID
   */
  static async getPatientById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!id || Array.isArray(id)) {
        return res.status(400).json({
          success: false,

          message: "Invalid patient id."
        });
      }

      const patient = await PatientService.getPatientById(id);

      if (!patient) {
        return res.status(404).json({
          success: false,

          message: "Patient not found."
        });
      }

      return res.status(200).json({
        success: true,

        data: patient
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update Patient
   */
  static async updatePatient(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!id || Array.isArray(id)) {
        return res.status(400).json({
          success: false,

          message: "Invalid patient id."
        });
      }

      const validatedData = updatePatientSchema.parse(req.validatedBody ?? req.body) as Partial<
        Omit<Patient, "createdAt" | "updatedAt">
      >;

      const patient = await PatientService.updatePatient(id, validatedData);

      if (!patient) {
        return res.status(404).json({
          success: false,

          message: "Patient not found."
        });
      }

      return res.status(200).json({
        success: true,

        message: "Patient updated successfully.",

        data: patient
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete Patient
   */
  static async deletePatient(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!id || Array.isArray(id)) {
        return res.status(400).json({
          success: false,

          message: "Invalid patient id."
        });
      }

      const patient = await PatientService.deletePatient(id);

      if (!patient) {
        return res.status(404).json({
          success: false,

          message: "Patient not found."
        });
      }

      return res.status(200).json({
        success: true,

        message: "Patient deleted successfully."
      });
    } catch (error) {
      next(error);
    }
  }
}

