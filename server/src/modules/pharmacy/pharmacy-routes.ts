import { Router } from "express";

import { authorizePermission } from "../../middlewares/authorize.js";
import { validateRequest } from "../../middlewares/validate-request.js";
import { PharmacyController } from "./pharmacy-controller.js";
import { createMedicineSchema, medicineIdSchema, updateMedicineSchema } from "./pharmacy-validation.js";

export const pharmacyRouter = Router();

pharmacyRouter.post("/", authorizePermission("pharmacy:create"), validateRequest(createMedicineSchema), (req, res, next) =>
  PharmacyController.createMedicine(req, res, next)
);
pharmacyRouter.get("/", authorizePermission("pharmacy:view"), (req, res, next) =>
  PharmacyController.getAllMedicines(req, res, next)
);
pharmacyRouter.get("/:id", authorizePermission("pharmacy:view"), validateRequest(medicineIdSchema), (req, res, next) =>
  PharmacyController.getMedicineById(req, res, next)
);
pharmacyRouter.patch(
  "/:id",
  authorizePermission("pharmacy:update"),
  validateRequest(medicineIdSchema),
  validateRequest(updateMedicineSchema),
  (req, res, next) => PharmacyController.updateMedicine(req, res, next)
);
pharmacyRouter.delete("/:id", authorizePermission("pharmacy:delete"), validateRequest(medicineIdSchema), (req, res, next) =>
  PharmacyController.deleteMedicine(req, res, next)
);
