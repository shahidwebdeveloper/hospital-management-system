import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

import { createPatient, getPatientById, updatePatient } from "@/services/patient-services";

const patientSchema = z.object({
  name: z.string().min(1, "Name is required"),

  phone: z.string().min(1, "Phone is required"),

  email: z.string().email("Invalid email").optional().or(z.literal("")),

  gender: z.enum(["male", "female", "other"]),

  dateOfBirth: z.string().optional(),

  bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", ""]).optional(),

  address: z.string().optional(),

  emergencyContactName: z.string().optional(),

  emergencyContactPhone: z.string().optional(),

  emergencyContactRelationship: z.string().optional(),

  allergies: z.string().optional(),

  medicalHistory: z.string().optional(),

  status: z.enum(["registered", "admitted", "discharged"])
});

type PatientForm = z.infer<typeof patientSchema>;

export default function PatientFormPage() {
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { id } = useParams();

  const isEdit = Boolean(id);

  const form = useForm<PatientForm>({
    resolver: zodResolver(patientSchema),

    defaultValues: {
      name: "",

      phone: "",

      email: "",

      gender: "male",

      dateOfBirth: "",

      bloodGroup: "",

      address: "",

      emergencyContactName: "",

      emergencyContactPhone: "",

      emergencyContactRelationship: "",

      allergies: "",

      medicalHistory: "",

      status: "registered"
    }
  });

  const { data } = useQuery({
    queryKey: ["patient", id],

    queryFn: () => getPatientById(id!),

    enabled: isEdit
  });

  useEffect(() => {
    if (!data?.data) return;

    const patient = data.data;

    form.reset({
      name: patient.name,

      phone: patient.phone,

      email: patient.email ?? "",

      gender: patient.gender,

      dateOfBirth: patient.dateOfBirth?.substring(0, 10) ?? "",

      bloodGroup: patient.bloodGroup ?? "",

      address: patient.address ?? "",

      emergencyContactName: patient.emergencyContact?.name ?? "",

      emergencyContactPhone: patient.emergencyContact?.phone ?? "",

      emergencyContactRelationship: patient.emergencyContact?.relationship ?? "",

      allergies: patient.allergies?.join(", ") ?? "",

      medicalHistory: patient.medicalHistory?.join(", ") ?? "",

      status: patient.status
    });
  }, [data, form]);
  const mutation = useMutation({
    mutationFn: async (values: PatientForm) => {
      const payload = {
        name: values.name,
        phone: values.phone,
        email: values.email || undefined,
        gender: values.gender,
        dateOfBirth: values.dateOfBirth || undefined,
        bloodGroup: values.bloodGroup || undefined,
        address: values.address || undefined,

        allergies: values.allergies ? values.allergies.split(",").map((item) => item.trim()) : [],

        medicalHistory: values.medicalHistory
          ? values.medicalHistory.split(",").map((item) => item.trim())
          : [],

        status: values.status
      };

      const hasEmergencyContact = Boolean(
        values.emergencyContactName?.trim() ||
        values.emergencyContactPhone?.trim() ||
        values.emergencyContactRelationship?.trim()
      );

      if (hasEmergencyContact) {
        Object.assign(payload, {
          emergencyContact: {
            name: values.emergencyContactName?.trim() || "",
            phone: values.emergencyContactPhone?.trim() || "",
            relationship: values.emergencyContactRelationship?.trim() || ""
          }
        });
      }

      if (isEdit) {
        return await updatePatient(id!, payload);
      }

      return await createPatient(payload);
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["patients"]
      });

      void navigate("/app/patients");
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to save patient right now. Please try again.";

      form.setError("root", {
        type: "server",
        message
      });
    }
  });
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{isEdit ? "Edit Patient" : "Add Patient"}</h1>

      <form
        onSubmit={form.handleSubmit((values) => mutation.mutate(values))}

        className="space-y-4"
      >
        {form.formState.errors.root ? (
          <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {form.formState.errors.root.message}
          </div>
        ) : null}
        <input
          placeholder="Full Name"

          {...form.register("name")}

          className="w-full border rounded p-2"
        />

        <input
          placeholder="Phone"

          {...form.register("phone")}

          className="w-full border rounded p-2"
        />

        <input
          placeholder="Email"

          {...form.register("email")}

          className="w-full border rounded p-2"
        />

        <select
          {...form.register("gender")}

          className="w-full border rounded p-2"
        >
          <option value="male">Male</option>

          <option value="female">Female</option>

          <option value="other">Other</option>
        </select>

        <input
          type="date"

          {...form.register("dateOfBirth")}

          className="w-full border rounded p-2"
        />

        <select
          {...form.register("bloodGroup")}

          className="w-full border rounded p-2"
        >
          <option value="">Select Blood Group</option>

          <option value="A+">A+</option>

          <option value="A-">A-</option>

          <option value="B+">B+</option>

          <option value="B-">B-</option>

          <option value="AB+">AB+</option>

          <option value="AB-">AB-</option>

          <option value="O+">O+</option>

          <option value="O-">O-</option>
        </select>

        <input
          placeholder="Address"

          {...form.register("address")}

          className="w-full border rounded p-2"
        />

        <hr />

        <h2 className="font-semibold">Emergency Contact</h2>

        <input
          placeholder="Contact Name"

          {...form.register("emergencyContactName")}

          className="w-full border rounded p-2"
        />

        <input
          placeholder="Contact Phone"

          {...form.register("emergencyContactPhone")}

          className="w-full border rounded p-2"
        />

        <input
          placeholder="Relationship"

          {...form.register("emergencyContactRelationship")}

          className="w-full border rounded p-2"
        />

        <input
          placeholder="Allergies (comma separated)"

          {...form.register("allergies")}

          className="w-full border rounded p-2"
        />

        <textarea
          placeholder="Medical History"

          {...form.register("medicalHistory")}

          className="w-full border rounded p-2"
        />

        <select
          {...form.register("status")}

          className="w-full border rounded p-2"
        >
          <option value="registered">Registered</option>

          <option value="admitted">Admitted</option>

          <option value="discharged">Discharged</option>
        </select>

        <button
          type="submit"

          disabled={mutation.isPending}

          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {mutation.isPending ? "Saving..." : isEdit ? "Update Patient" : "Create Patient"}
        </button>
      </form>
    </div>
  );
}
