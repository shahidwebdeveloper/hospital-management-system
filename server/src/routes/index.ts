import { Router } from "express";

import { appointmentRouter } from "../modules/appointments/appointment-routes.js";
import { doctorRouter } from "../modules/doctors/doctor-routes.js";
import { healthRouter } from "../modules/health/health.routes.js";
import { medicalRecordRouter } from "../modules/medical-records/medical-record-routes.js";
import { resourceRouter } from "../modules/resources/resource-routes.js";
import { patientRouter } from "../modules/patients/patient-routes.js";
import { prescriptionRouter } from "../modules/prescriptions/prescription-routes.js";
import laboratoryRouter from "../modules/laboratory/laboratory-route.js";

export const apiRouter = Router();

apiRouter.use("/health", healthRouter);
apiRouter.use("/resources", resourceRouter);
apiRouter.use("/patients", patientRouter);
apiRouter.use("/doctors", doctorRouter);
apiRouter.use("/appointments", appointmentRouter);
apiRouter.use("/medical-records", medicalRecordRouter);
apiRouter.use("/prescriptions", prescriptionRouter);
apiRouter.use("/laboratory", laboratoryRouter);