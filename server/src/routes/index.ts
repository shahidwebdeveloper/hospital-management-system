import { Router } from "express";

import { appointmentRouter } from "../modules/appointments/appointment-routes.js";
import { doctorRouter } from "../modules/doctors/doctor-routes.js";
import { healthRouter } from "../modules/health/health.routes.js";
import { medicalRecordRouter } from "../modules/medical-records/medical-record-routes.js";
import { authenticate } from "../middlewares/authenticate.js";
import { patientRouter } from "../modules/patients/patient-routes.js";
import { prescriptionRouter } from "../modules/prescriptions/prescription-routes.js";
import laboratoryRouter from "../modules/laboratory/laboratory-route.js";
import { userRouter } from "../modules/user/user-routes.js";
import { pharmacyRouter } from "../modules/pharmacy/pharmacy-routes.js";
import { billingRouter } from "../modules/billing/billing-routes.js";

export const apiRouter = Router();

apiRouter.use("/health", healthRouter);
// require authentication for most API routes
apiRouter.use(authenticate);
apiRouter.use("/patients", patientRouter);
apiRouter.use("/doctors", doctorRouter);
apiRouter.use("/appointments", appointmentRouter);
apiRouter.use("/medical-records", medicalRecordRouter);
apiRouter.use("/prescriptions", prescriptionRouter);
apiRouter.use("/laboratory", laboratoryRouter);
apiRouter.use("/pharmacy", pharmacyRouter);
apiRouter.use("/billing", billingRouter);
apiRouter.use("/users", userRouter);
