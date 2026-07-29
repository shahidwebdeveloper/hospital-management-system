import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createPrescription,
  getPrescriptionById,
  updatePrescription,
  type Prescription,
  type PrescriptionItem
} from "@/services/prescription-services";

export default function PrescriptionFormPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    patientId: "",
    doctorId: "",
    appointmentId: "",
    notes: "",
    status: "issued" as Prescription["status"],
    items: [] as PrescriptionItem[]
  });

  const { data } = useQuery({
    queryKey: ["prescription", id],
    queryFn: () => getPrescriptionById(id!),
    enabled: isEdit
  });

  useEffect(() => {
    if (!data?.data) return;

    const prescription = data.data;
    setForm({
      patientId: prescription.patientId ?? "",
      doctorId: prescription.doctorId ?? "",
      appointmentId: prescription.appointmentId ?? "",
      notes: prescription.notes ?? "",
      status: prescription.status ?? "issued",
      items: prescription.items ?? []
    });
  }, [data]);

  const handleItemChange = (index: number, field: keyof PrescriptionItem, value: string) => {
    const nextItems: PrescriptionItem[] = [...form.items];
    const currentItem = nextItems[index] ?? {
      medicineName: "",
      dosage: "",
      duration: "",
      instructions: ""
    };
    nextItems[index] = { ...currentItem, [field]: value } as PrescriptionItem;
    setForm({ ...form, items: nextItems });
  };

  const addItem = () => {
    setForm({
      ...form,
      items: [...form.items, { medicineName: "", dosage: "", duration: "", instructions: "" }]
    });
  };

  const removeItem = (index: number) => {
    setForm({ ...form, items: form.items.filter((_, itemIndex) => itemIndex !== index) });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload = {
      ...form,
      items: form.items.filter((item) => item.medicineName.trim())
    };

    if (isEdit && id) {
      await updatePrescription(id, payload);
    } else {
      await createPrescription(payload);
    }

    await queryClient.invalidateQueries({ queryKey: ["prescriptions"] });
    navigate("/app/prescriptions");
  };

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="mb-6 text-2xl font-bold">
        {isEdit ? "Edit Prescription" : "Create Prescription"}
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
          placeholder="Doctor ID"
          value={form.doctorId}
          onChange={(event) => setForm({ ...form, doctorId: event.target.value })}
          required
        />
        <input
          className="w-full rounded border p-2"
          placeholder="Appointment ID"
          value={form.appointmentId}
          onChange={(event) => setForm({ ...form, appointmentId: event.target.value })}
        />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Medicines</h2>
            <button
              type="button"
              onClick={addItem}
              className="rounded bg-gray-600 px-3 py-1 text-white"
            >
              Add Medicine
            </button>
          </div>

          {form.items.map((item, index) => (
            <div key={`${item.medicineName}-${index}`} className="rounded border p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-medium">Medicine {index + 1}</span>
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="text-sm text-red-600"
                >
                  Remove
                </button>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <input
                  className="rounded border p-2"
                  placeholder="Medicine name"
                  value={item.medicineName}
                  onChange={(event) => handleItemChange(index, "medicineName", event.target.value)}
                />
                <input
                  className="rounded border p-2"
                  placeholder="Dosage"
                  value={item.dosage}
                  onChange={(event) => handleItemChange(index, "dosage", event.target.value)}
                />
                <input
                  className="rounded border p-2"
                  placeholder="Duration"
                  value={item.duration}
                  onChange={(event) => handleItemChange(index, "duration", event.target.value)}
                />
                <input
                  className="rounded border p-2"
                  placeholder="Instructions"
                  value={item.instructions ?? ""}
                  onChange={(event) => handleItemChange(index, "instructions", event.target.value)}
                />
              </div>
            </div>
          ))}
        </div>

        <textarea
          className="w-full rounded border p-2"
          placeholder="Notes"
          value={form.notes}
          onChange={(event) => setForm({ ...form, notes: event.target.value })}
        />

        <select
          className="w-full rounded border p-2"
          value={form.status}
          onChange={(event) =>
            setForm({ ...form, status: event.target.value as Prescription["status"] })
          }
        >
          <option value="issued">Issued</option>
          <option value="dispensed">Dispensed</option>
          <option value="partially_dispensed">Partially Dispensed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <button type="submit" className="rounded bg-green-600 px-4 py-2 text-white">
          {isEdit ? "Update Prescription" : "Save Prescription"}
        </button>
      </form>
    </div>
  );
}
