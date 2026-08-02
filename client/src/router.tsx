import { Navigate, createBrowserRouter } from "react-router-dom";

import AppLayout from "./layouts/app-layout";
import Dashboard from "./pages/dashboard";
import LandingPage from "./pages/landing-page";
import ModulePage from "@/pages/modules/module-page";
import Login from "./pages/signin-page";
import Register from "./pages/signup-page";

import AppointmentFormPage from "@/pages/appointments/appointment-form-page";
import AppointmentListPage from "@/pages/appointments/appointment-list-page";

import DoctorDetailsPage from "@/pages/doctors/doctor-details-page";
import DoctorListPage from "@/pages/doctors/doctor-list-page";
import DoctorFormPage from "@/pages/doctors/doctor-form-page";

import MedicalRecordDetailsPage from "@/pages/medical-records/medical-record-details-page";
import MedicalRecordFormPage from "@/pages/medical-records/medical-record-form-page";
import MedicalRecordListPage from "@/pages/medical-records/medical-record-list-page";

import PrescriptionDetailsPage from "@/pages/prescriptions/prescription-details-page";
import PrescriptionFormPage from "@/pages/prescriptions/prescription-form-page";
import PrescriptionListPage from "@/pages/prescriptions/prescription-list-page";

import PatientListPage from "@/pages/patients/patient-list-page";
import PatientFormPage from "@/pages/patients/patient-form-page";
import PatientDetailsPage from "@/pages/patients/patient-details-page";

import PharmacyListPage from "@/pages/pharmacy/PharmacyListPage";
import PharmacyFormPage from "@/pages/pharmacy/PharmacyFormPage";
import PharmacyDetailsPage from "@/pages/pharmacy/PharmacyDetailsPage";

import BillingListPage from "@/pages/billing/BillingListPage";
import BillingFormPage from "@/pages/billing/BillingFormPage";
import BillingDetailsPage from "@/pages/billing/BillingDetailsPage";

import AdminPage from "./pages/roles/admin-page";
import UsersListPage from "./pages/roles/users-list-page";

// Laboratory pages
import RequestTestPage from "@/pages/laboratory/RequestTestPage";
import LaboratoryQueuePage from "@/pages/laboratory/LaboratoryQueuePage";
import ResultEntryPage from "@/pages/laboratory/ResultEntryPage";
import LaboratoryDetailsPage from "@/pages/laboratory/LaboratoryDetailsPage";

import { moduleDefinitions } from "@hms/contracts";
import ErrorPage from "./components/ErrorPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
    errorElement: <ErrorPage />
  },

  {
    path: "/app",
    element: <AppLayout />,
    errorElement: <ErrorPage />,

    children: [
      {
        index: true,
        element: <Navigate to="/app/dashboard" replace />
      },

      {
        path: "dashboard",
        element: <Dashboard />
      },

      {
        path: "doctors",

        children: [
          {
            index: true,
            element: <DoctorListPage />
          },

          {
            path: "new",
            element: <DoctorFormPage />
          },

          {
            path: ":id",
            element: <DoctorDetailsPage />
          },

          {
            path: ":id/edit",
            element: <DoctorFormPage />
          }
        ]
      },

      {
        path: "appointments",

        children: [
          {
            index: true,
            element: <AppointmentListPage />
          },

          {
            path: "new",
            element: <AppointmentFormPage />
          }
        ]
      },

      {
        path: "medical-records",

        children: [
          {
            index: true,
            element: <MedicalRecordListPage />
          },

          {
            path: "new",
            element: <MedicalRecordFormPage />
          },

          {
            path: ":id",
            element: <MedicalRecordDetailsPage />
          },

          {
            path: ":id/edit",
            element: <MedicalRecordFormPage />
          }
        ]
      },

      {
        path: "prescriptions",

        children: [
          {
            index: true,
            element: <PrescriptionListPage />
          },

          {
            path: "new",
            element: <PrescriptionFormPage />
          },

          {
            path: ":id",
            element: <PrescriptionDetailsPage />
          },

          {
            path: ":id/edit",
            element: <PrescriptionFormPage />
          }
        ]
      },

      {
        path: "patients",

        children: [
          {
            index: true,
            element: <PatientListPage />
          },

          {
            path: "new",
            element: <PatientFormPage />
          },

          {
            path: ":id",
            element: <PatientDetailsPage />
          },

          {
            path: ":id/edit",
            element: <PatientFormPage />
          }
        ]
      },

      {
        path: "pharmacy",

        children: [
          {
            index: true,
            element: <PharmacyListPage />
          },

          {
            path: "new",
            element: <PharmacyFormPage />
          },

          {
            path: ":id",
            element: <PharmacyDetailsPage />
          },

          {
            path: ":id/edit",
            element: <PharmacyFormPage />
          }
        ]
      },

      {
        path: "billing",

        children: [
          {
            index: true,
            element: <BillingListPage />
          },

          {
            path: "new",
            element: <BillingFormPage />
          },

          {
            path: ":id",
            element: <BillingDetailsPage />
          },

          {
            path: ":id/edit",
            element: <BillingFormPage />
          }
        ]
      },

      // ==========================
      // Laboratory Module
      // ==========================

      {
        path: "laboratory",

        children: [
          {
            index: true,
            element: <LaboratoryQueuePage />
          },

          {
            path: "request",
            element: <RequestTestPage />
          },

          {
            path: "result/:id",
            element: <ResultEntryPage />
          },

          {
            path: ":id",
            element: <LaboratoryDetailsPage />
          }
        ]
      },

      {
        path: "users",
        children: [
          { index: true, element: <AdminPage /> },
          { path: "manage", element: <UsersListPage /> }
        ]
      },

      ...moduleDefinitions.map((module) => ({
        path: module.path.replace(/^\//, ""),

        element: <ModulePage moduleKey={module.key} />
      }))
    ]
  },

  {
    path: "/login",
    element: <Login />
  },

  {
    path: "/signup",
    element: <Register />
  },

  {
    path: "/patients",
    element: <PatientListPage />
  },

  {
    path: "/patients/new",
    element: <PatientFormPage />
  },

  {
    path: "/patients/:id",
    element: <PatientDetailsPage />
  },

  {
    path: "/patients/:id/edit",
    element: <PatientFormPage />
  }
]);
