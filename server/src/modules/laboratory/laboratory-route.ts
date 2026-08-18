import { Router } from "express";

import { authorizePermission } from "../../middlewares/authorize.js";
import { LaboratoryController } from "./laboratory-controller.js";

const laboratoryRouter = Router();

laboratoryRouter.post("/", authorizePermission("laboratory:create"), (req, res, next) =>
  LaboratoryController.createRequest(req, res, next)
);
laboratoryRouter.get("/", authorizePermission("laboratory:view"), (req, res, next) =>
  LaboratoryController.getAllRequests(req, res, next)
);
laboratoryRouter.get("/queue", authorizePermission("laboratory:manage"), (req, res, next) =>
  LaboratoryController.getQueue(req, res, next)
);
laboratoryRouter.get("/:id", authorizePermission("laboratory:view"), (req, res, next) =>
  LaboratoryController.getRequestById(req, res, next)
);
laboratoryRouter.patch("/:id/status", authorizePermission("laboratory:manage"), (req, res, next) =>
  LaboratoryController.updateStatus(req, res, next)
);
laboratoryRouter.patch("/:id/result", authorizePermission("laboratory:manage"), (req, res, next) =>
  LaboratoryController.enterResult(req, res, next)
);
laboratoryRouter.patch("/:id/cancel", authorizePermission("laboratory:create"), (req, res, next) =>
  LaboratoryController.cancelRequest(req, res, next)
);
laboratoryRouter.delete("/:id", authorizePermission("laboratory:delete"), (req, res, next) =>
  LaboratoryController.deleteRequest(req, res, next)
);

export default laboratoryRouter;
