import { Router } from "express";
import { PharmacyController } from "./pharmacy-controller.js";
import { validateRequest } from "../../middlewares/validate-request.js";
import {
  createMedicineSchema,
  updateMedicineSchema,
  medicineIdSchema
} from "./pharmacy-validation.js";

export const pharmacyRouter = Router();

pharmacyRouter.post("/", validateRequest(createMedicineSchema), (req, res, next) =>
  PharmacyController.createMedicine(req, res, next)
);

pharmacyRouter.get("/", (req, res, next) => PharmacyController.getAllMedicines(req, res, next));

pharmacyRouter.get("/:id", validateRequest(medicineIdSchema), (req, res, next) =>
  PharmacyController.getMedicineById(req, res, next)
);

pharmacyRouter.patch(
  "/:id",
  validateRequest(medicineIdSchema),
  validateRequest(updateMedicineSchema),
  (req, res, next) => PharmacyController.updateMedicine(req, res, next)
);

pharmacyRouter.delete("/:id", validateRequest(medicineIdSchema), (req, res, next) =>
  PharmacyController.deleteMedicine(req, res, next)
);
