import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createMedicalRecord,
  getMedicalRecordById,
  updateMedicalRecord
} from "@/services/medical-record-services";
import type { MedicalRecord } from "@/services/medical-record-services";

export default function MedicalRecordFormPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [form, setForm] = useState<{
    patientId: string;
    appointmentId: string;
    doctorId: string;
    diagnosis: string;
    symptoms: string;
    treatmentPlan: string;
    doctorNotes: string;
    followUpDate: string;
    status: MedicalRecord["status"];
  }>({
    patientId: "",
    appointmentId: "",
    doctorId: "",
    diagnosis: "",
    symptoms: "",
    treatmentPlan: "",
    doctorNotes: "",
    followUpDate: "",
    status: "draft"
  });

  const { data } = useQuery({
    queryKey: ["medical-record", id],
    queryFn: () => getMedicalRecordById(id!),
    enabled: isEdit
  });

  useEffect(() => {
    if (!data?.data) return;

    const record = data.data;
    setForm({
      patientId: record.patientId ?? "",
      appointmentId: record.appointmentId ?? "",
      doctorId: record.doctorId ?? "",
      diagnosis: record.diagnosis ?? "",
      symptoms: record.symptoms?.join(", ") ?? "",
      treatmentPlan: record.treatmentPlan ?? "",
      doctorNotes: record.doctorNotes ?? "",
      followUpDate: record.followUpDate ?? "",
      status: record.status ?? "draft"
    });
  }, [data]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload = {
      ...form,
      symptoms: form.symptoms
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    };

    if (isEdit && id) {
      await updateMedicalRecord(id, payload);
    } else {
      await createMedicalRecord(payload);
    }

    await queryClient.invalidateQueries({ queryKey: ["medical-records"] });
    navigate("/app/medical-records");
  };

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="mb-6 text-2xl font-bold">
        {isEdit ? "Edit Medical Record" : "Create Medical Record"}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4 rounded border bg-white p-6 shadow">
        <input
          className="w-full rounded border p-2"
          placeholder="Patient ID"
          value={form.patientId}
          onChange={(event) => setForm({ ...form, patientId: event.target.value })}
          required
        />
        <input
          className="w-full rounded border p-2"
          placeholder="Appointment ID"
          value={form.appointmentId}
          onChange={(event) => setForm({ ...form, appointmentId: event.target.value })}
        />
        <input
          className="w-full rounded border p-2"
          placeholder="Doctor ID"
          value={form.doctorId}
          onChange={(event) => setForm({ ...form, doctorId: event.target.value })}
          required
        />
        <input
          className="w-full rounded border p-2"
          placeholder="Diagnosis"
          value={form.diagnosis}
          onChange={(event) => setForm({ ...form, diagnosis: event.target.value })}
          required
        />
        <input
          className="w-full rounded border p-2"
          placeholder="Symptoms (comma separated)"
          value={form.symptoms}
          onChange={(event) => setForm({ ...form, symptoms: event.target.value })}
        />
        <textarea
          className="w-full rounded border p-2"
          placeholder="Treatment plan"
          value={form.treatmentPlan}
          onChange={(event) => setForm({ ...form, treatmentPlan: event.target.value })}
        />
        <textarea
          className="w-full rounded border p-2"
          placeholder="Doctor notes"
          value={form.doctorNotes}
          onChange={(event) => setForm({ ...form, doctorNotes: event.target.value })}
        />
        <input
          className="w-full rounded border p-2"
          type="date"
          value={form.followUpDate}
          onChange={(event) => setForm({ ...form, followUpDate: event.target.value })}
        />
        <select
          className="w-full rounded border p-2"
          value={form.status}
          onChange={(event) =>
            setForm({ ...form, status: event.target.value as typeof form.status })
          }
        >
          <option value="draft">Draft</option>
          <option value="active">Active</option>
          <option value="closed">Closed</option>
          <option value="follow_up">Follow Up</option>
        </select>
        <button type="submit" className="rounded bg-green-600 px-4 py-2 text-white">
          {isEdit ? "Update Record" : "Save Record"}
        </button>
      </form>
    </div>
  );
}
