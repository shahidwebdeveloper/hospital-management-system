import type { NextFunction, Request, Response } from "express";
import type { FilterQuery } from "mongoose";

import { AppointmentModel } from "../modules/appointments/appointment-model.js";
import { InvoiceModel } from "../modules/billing/billing-model.js";
import { Laboratory } from "../modules/laboratory/laboratory-model.js";
import { MedicalRecordModel } from "../modules/medical-records/medical-record-model.js";
import { PatientModel } from "../modules/patients/patient-model.js";
import { PrescriptionModel } from "../modules/prescriptions/prescription-model.js";

export type ProtectedResource =
  "patient" | "appointment" | "medical-record" | "prescription" | "laboratory" | "invoice";

export type ResourceDocument = {
  _id: { toString(): string };
  patientId?: string;
  doctorId?: string;
  patient?: { toString(): string };
  doctor?: { toString(): string };
  userId?: { toString(): string };
};

function idValue(value: string | { toString(): string } | undefined) {
  return value === undefined ? undefined : value.toString();
}

const elevatedRoles = new Set(["super_admin", "admin"]);

export async function patientIdForUser(userId: string) {
  const patient = await PatientModel.findOne({ userId }).select("_id").lean();
  return patient ? String(patient._id) : null;
}

async function loadResource(resource: ProtectedResource, id: string) {
  switch (resource) {
    case "patient":
      return PatientModel.findById(id).lean();
    case "appointment":
      return AppointmentModel.findById(id).lean();
    case "medical-record":
      return MedicalRecordModel.findById(id).lean();
    case "prescription":
      return PrescriptionModel.findById(id).lean();
    case "laboratory":
      return Laboratory.findById(id).lean();
    case "invoice":
      return InvoiceModel.findById(id).lean();
  }
}

export function canAccessResource(
  user: NonNullable<Request["user"]>,
  resource: ProtectedResource,
  document: ResourceDocument,
  patientId: string | null
) {
  if (elevatedRoles.has(user.role)) return true;

  if (user.role === "patient") {
    const relatedPatientId =
      resource === "patient"
        ? document._id.toString()
        : (document.patientId ?? document.patient?.toString());
    return Boolean(patientId && relatedPatientId === patientId);
  }

  if (user.role === "doctor") {
    return (
      (resource === "appointment" ||
        resource === "medical-record" ||
        resource === "prescription" ||
        resource === "laboratory") &&
      (idValue(document.doctorId) === user.id || idValue(document.doctor) === user.id)
    );
  }

  // Nurses have no assignment model yet, so they must not receive broad access until one exists.
  if (user.role === "nurse") return false;
  if (user.role === "lab_technician") return resource === "laboratory";
  if (user.role === "pharmacist") return resource === "prescription";
  if (user.role === "receptionist")
    return resource === "patient" || resource === "appointment" || resource === "invoice";
  return false;
}

export function authorizeResource(resource: ProtectedResource) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) return res.status(401).json({ success: false, message: "Unauthorized" });
      const id = String(req.params.id ?? "");
      const document = await loadResource(resource, id);
      if (!document) return res.status(404).json({ success: false, message: "Record not found" });

      const patientId = req.user.role === "patient" ? await patientIdForUser(req.user.id) : null;
      if (!canAccessResource(req.user, resource, document as ResourceDocument, patientId)) {
        return res
          .status(403)
          .json({ success: false, message: "You do not have access to this record" });
      }

      req.authorizedResource = document;
      return next();
    } catch (error) {
      return next(error);
    }
  };
}

export async function resourceScope(
  resource: ProtectedResource,
  user: NonNullable<Request["user"]>
): Promise<FilterQuery<unknown>> {
  if (elevatedRoles.has(user.role)) return {};
  if (user.role === "patient") {
    const patientId = await patientIdForUser(user.id);
    if (!patientId) return { _id: null };
    return resource === "patient"
      ? { _id: patientId }
      : resource === "laboratory"
        ? { patient: patientId }
        : { patientId };
  }
  if (user.role === "doctor")
    return resource === "laboratory" ? { doctor: user.id } : { doctorId: user.id };
  if (user.role === "nurse") return { _id: null };
  if (user.role === "lab_technician") return resource === "laboratory" ? {} : { _id: null };
  if (user.role === "pharmacist") return resource === "prescription" ? {} : { _id: null };
  if (user.role === "receptionist")
    return ["patient", "appointment", "invoice"].includes(resource) ? {} : { _id: null };
  return { _id: null };
}
