import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createDoctor, getDoctorById, updateDoctor } from "@/services/doctor-services";

const doctorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().min(1, "Phone is required"),
  specialization: z.string().min(1, "Specialization is required"),
  department: z.string().min(1, "Department is required"),
  licenseNumber: z.string().min(1, "License number is required"),
  availableDays: z.string().optional(),
  availableTime: z.string().optional(),
  status: z.enum(["available", "busy", "off_duty", "inactive"])
});

type DoctorForm = z.infer<typeof doctorSchema>;

export default function DoctorFormPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const form = useForm<DoctorForm>({
    resolver: zodResolver(doctorSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      specialization: "",
      department: "",
      licenseNumber: "",
      availableDays: "",
      availableTime: "09:00-17:00",
      status: "available"
    }
  });

  const { data } = useQuery({
    queryKey: ["doctor", id],
    queryFn: () => getDoctorById(id!),
    enabled: isEdit
  });

  useEffect(() => {
    if (!data?.data) return;
    const doctor = data.data;
    form.reset({
      name: doctor.name,
      email: doctor.email ?? "",
      phone: doctor.phone,
      specialization: doctor.specialization,
      department: doctor.department,
      licenseNumber: doctor.licenseNumber,
      availableDays: doctor.availableDays?.join(", ") ?? "",
      availableTime: doctor.availableTime ?? "09:00-17:00",
      status: doctor.status
    });
  }, [data, form]);

  const mutation = useMutation({
    mutationFn: async (values: DoctorForm) => {
      const payload = {
        name: values.name,
        email: values.email || undefined,
        phone: values.phone,
        specialization: values.specialization,
        department: values.department,
        licenseNumber: values.licenseNumber,
        availableDays: values.availableDays
          ? values.availableDays.split(",").map((item) => item.trim())
          : [],
        availableTime: values.availableTime || "09:00-17:00",
        status: values.status
      };

      if (isEdit) return updateDoctor(id!, payload);
      return createDoctor(payload);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["doctors"] });
      void navigate("/app/doctors");
    }
  });

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="mb-6 text-3xl font-bold">{isEdit ? "Edit Doctor" : "Add Doctor"}</h1>
      <form onSubmit={form.handleSubmit((values) => mutation.mutate(values))} className="space-y-4">
        <input
          placeholder="Full Name"
          {...form.register("name")}
          className="w-full rounded border p-2"
        />
        <input
          placeholder="Email"
          {...form.register("email")}
          className="w-full rounded border p-2"
        />
        <input
          placeholder="Phone"
          {...form.register("phone")}
          className="w-full rounded border p-2"
        />
        <input
          placeholder="Specialization"
          {...form.register("specialization")}
          className="w-full rounded border p-2"
        />
        <input
          placeholder="Department"
          {...form.register("department")}
          className="w-full rounded border p-2"
        />
        <input
          placeholder="License Number"
          {...form.register("licenseNumber")}
          className="w-full rounded border p-2"
        />
        <input
          placeholder="Available Days (e.g. Monday, Wednesday)"
          {...form.register("availableDays")}
          className="w-full rounded border p-2"
        />
        <input
          placeholder="Available Time"
          {...form.register("availableTime")}
          className="w-full rounded border p-2"
        />
        <select {...form.register("status")} className="w-full rounded border p-2">
          <option value="available">Available</option>
          <option value="busy">Busy</option>
          <option value="off_duty">Off Duty</option>
          <option value="inactive">Inactive</option>
        </select>
        <button
          type="submit"
          disabled={mutation.isPending}
          className="rounded bg-blue-600 px-4 py-2 text-white"
        >
          {mutation.isPending ? "Saving..." : isEdit ? "Update Doctor" : "Create Doctor"}
        </button>
      </form>
    </div>
  );
}
