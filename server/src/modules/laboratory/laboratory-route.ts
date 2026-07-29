import { Router } from "express";
import { LaboratoryController } from "./laboratory-controller.js";

const laboratoryRouter = Router();

// Doctor
laboratoryRouter.post("/", LaboratoryController.createRequest);

laboratoryRouter.get("/", LaboratoryController.getAllRequests);

laboratoryRouter.get("/queue", LaboratoryController.getQueue);

laboratoryRouter.get("/:id", LaboratoryController.getRequestById);

laboratoryRouter.patch("/:id/status", LaboratoryController.updateStatus);

laboratoryRouter.patch("/:id/result", LaboratoryController.enterResult);

laboratoryRouter.patch("/:id/cancel", LaboratoryController.cancelRequest);

laboratoryRouter.delete("/:id", LaboratoryController.deleteRequest);

export default laboratoryRouter;
