import type { ReactElement } from "react";
import { Navigate, createBrowserRouter } from "react-router-dom";

import { moduleAccess, moduleDefinitions } from "@hms/contracts";
import type { AppRouteModule } from "@hms/contracts";

import ProtectedRoute from "./components/ProtectedRoute";
import ErrorPage from "./components/ErrorPage";
import AppLayout from "./layouts/app-layout";
import Dashboard from "./pages/dashboard";
import LandingPage from "./pages/landing-page";
import Login from "./pages/signin-page";
import Register from "./pages/signup-page";

import AppointmentFormPage from "@/pages/appointments/appointment-form-page";
import AppointmentListPage from "@/pages/appointments/appointment-list-page";
import BillingDetailsPage from "@/pages/billing/BillingDetailsPage";
import BillingFormPage from "@/pages/billing/BillingFormPage";
import BillingListPage from "@/pages/billing/BillingListPage";
import DoctorDetailsPage from "@/pages/doctors/doctor-details-page";
import DoctorFormPage from "@/pages/doctors/doctor-form-page";
import DoctorListPage from "@/pages/doctors/doctor-list-page";
import LaboratoryDetailsPage from "@/pages/laboratory/LaboratoryDetailsPage";
import LaboratoryQueuePage from "@/pages/laboratory/LaboratoryQueuePage";
import RequestTestPage from "@/pages/laboratory/RequestTestPage";
import ResultEntryPage from "@/pages/laboratory/ResultEntryPage";
import MedicalRecordDetailsPage from "@/pages/medical-records/medical-record-details-page";
import MedicalRecordFormPage from "@/pages/medical-records/medical-record-form-page";
import MedicalRecordListPage from "@/pages/medical-records/medical-record-list-page";
import ModulePage from "@/pages/modules/module-page";
import PatientDetailsPage from "@/pages/patients/patient-details-page";
import PatientFormPage from "@/pages/patients/patient-form-page";
import PatientListPage from "@/pages/patients/patient-list-page";
import PharmacyDetailsPage from "@/pages/pharmacy/PharmacyDetailsPage";
import PharmacyFormPage from "@/pages/pharmacy/PharmacyFormPage";
import PharmacyListPage from "@/pages/pharmacy/PharmacyListPage";
import PrescriptionDetailsPage from "@/pages/prescriptions/prescription-details-page";
import PrescriptionFormPage from "@/pages/prescriptions/prescription-form-page";
import PrescriptionListPage from "@/pages/prescriptions/prescription-list-page";
import AdminPage from "./pages/roles/admin-page";
import UsersListPage from "./pages/roles/users-list-page";

function withRoles(element: ReactElement, module: AppRouteModule) {
  return <ProtectedRoute allowedRoles={moduleAccess[module]}>{element}</ProtectedRoute>;
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
    errorElement: <ErrorPage />
  },
  {
    path: "/app",
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Navigate to="/app/dashboard" replace /> },
      { path: "dashboard", element: withRoles(<Dashboard />, "dashboard") },
      {
        path: "doctors",
        children: [
          { index: true, element: withRoles(<DoctorListPage />, "doctors") },
          { path: "new", element: withRoles(<DoctorFormPage />, "doctors") },
          { path: ":id", element: withRoles(<DoctorDetailsPage />, "doctors") },
          { path: ":id/edit", element: withRoles(<DoctorFormPage />, "doctors") }
        ]
      },
      {
        path: "appointments",
        children: [
          { index: true, element: withRoles(<AppointmentListPage />, "appointments") },
          { path: "new", element: withRoles(<AppointmentFormPage />, "appointments") }
        ]
      },
      {
        path: "medical-records",
        children: [
          { index: true, element: withRoles(<MedicalRecordListPage />, "medical-records") },
          { path: "new", element: withRoles(<MedicalRecordFormPage />, "medical-records") },
          { path: ":id", element: withRoles(<MedicalRecordDetailsPage />, "medical-records") },
          { path: ":id/edit", element: withRoles(<MedicalRecordFormPage />, "medical-records") }
        ]
      },
      {
        path: "prescriptions",
        children: [
          { index: true, element: withRoles(<PrescriptionListPage />, "prescriptions") },
          { path: "new", element: withRoles(<PrescriptionFormPage />, "prescriptions") },
          { path: ":id", element: withRoles(<PrescriptionDetailsPage />, "prescriptions") },
          { path: ":id/edit", element: withRoles(<PrescriptionFormPage />, "prescriptions") }
        ]
      },
      {
        path: "patients",
        children: [
          { index: true, element: withRoles(<PatientListPage />, "patients") },
          { path: "new", element: withRoles(<PatientFormPage />, "patients") },
          { path: ":id", element: withRoles(<PatientDetailsPage />, "patients") },
          { path: ":id/edit", element: withRoles(<PatientFormPage />, "patients") }
        ]
      },
      {
        path: "pharmacy",
        children: [
          { index: true, element: withRoles(<PharmacyListPage />, "pharmacy") },
          { path: "new", element: withRoles(<PharmacyFormPage />, "pharmacy") },
          { path: ":id", element: withRoles(<PharmacyDetailsPage />, "pharmacy") },
          { path: ":id/edit", element: withRoles(<PharmacyFormPage />, "pharmacy") }
        ]
      },
      {
        path: "billing",
        children: [
          { index: true, element: withRoles(<BillingListPage />, "billing") },
          { path: "new", element: withRoles(<BillingFormPage />, "billing") },
          { path: ":id", element: withRoles(<BillingDetailsPage />, "billing") },
          { path: ":id/edit", element: withRoles(<BillingFormPage />, "billing") }
        ]
      },
      {
        path: "laboratory",
        children: [
          { index: true, element: withRoles(<LaboratoryQueuePage />, "laboratory") },
          { path: "request", element: withRoles(<RequestTestPage />, "laboratory") },
          { path: "result/:id", element: withRoles(<ResultEntryPage />, "laboratory") },
          { path: ":id", element: withRoles(<LaboratoryDetailsPage />, "laboratory") }
        ]
      },
      {
        path: "users",
        children: [
          { index: true, element: withRoles(<AdminPage />, "users") },
          { path: "manage", element: withRoles(<UsersListPage />, "users") }
        ]
      },
      ...moduleDefinitions.map((module) => ({
        path: module.path.replace(/^\//, ""),
        element: withRoles(<ModulePage moduleKey={module.key} />, module.key)
      }))
    ]
  },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Register /> },
  { path: "/patients", element: withRoles(<PatientListPage />, "patients") },
  { path: "/patients/new", element: withRoles(<PatientFormPage />, "patients") },
  { path: "/patients/:id", element: withRoles(<PatientDetailsPage />, "patients") },
  { path: "/patients/:id/edit", element: withRoles(<PatientFormPage />, "patients") }
]);
