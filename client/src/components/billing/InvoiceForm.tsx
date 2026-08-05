import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useCreateInvoice, useUpdateInvoice } from "@/hooks/use-billing";
import { useAppointments } from "@/hooks/use-appointments";
import { useLaboratoryRequests } from "@/hooks/use-laboratory";
import { useMedicines } from "@/hooks/use-pharmacy";
import { usePatients } from "@/hooks/use-patients";
import type { CreateInvoice, Invoice, InvoiceLineItem } from "@/types/billing";

interface InvoiceFormProps {
  initialValues?: Partial<Invoice>;
  invoiceId?: string;
  onSuccess?: () => void;
}

const defaultLineItem: InvoiceLineItem = {
  description: "",
  quantity: 1,
  unitPrice: 0,
  amount: 0,
  category: ""
};

export function InvoiceForm({ initialValues, invoiceId, onSuccess }: InvoiceFormProps) {
  const navigate = useNavigate();
  const createMutation = useCreateInvoice();
  const updateMutation = useUpdateInvoice();

  const { data: patientResponse } = usePatients();
  const patients = patientResponse ?? [];

  const { data: appointmentResponse } = useAppointments();
  const appointments = appointmentResponse?.data ?? [];

  const { data: laboratoryResponse } = useLaboratoryRequests();
  const laboratoryRequests = laboratoryResponse ?? [];

  const { data: medicineResponse } = useMedicines();
  const medicines = medicineResponse ?? [];

  const [selectedAppointmentId, setSelectedAppointmentId] = useState("");
  const [selectedLaboratoryId, setSelectedLaboratoryId] = useState("");
  const [selectedMedicineId, setSelectedMedicineId] = useState("");
  const [medicineQuantity, setMedicineQuantity] = useState(1);

  const [invoice, setInvoice] = useState<Partial<Invoice>>({
    invoiceNumber: initialValues?.invoiceNumber ?? "",
    patientId: initialValues?.patientId ?? "",
    patientName: initialValues?.patientName ?? "",
    items: initialValues?.items ?? [defaultLineItem],
    paidAmount: initialValues?.paidAmount ?? 0,
    status: initialValues?.status ?? "draft",
    paymentMethod: initialValues?.paymentMethod ?? "",
    notes: initialValues?.notes ?? "",
    dueDate: initialValues?.dueDate ?? ""
  });

  const items = invoice.items ?? [defaultLineItem];

  const selectedPatient = useMemo(
    () => patients.find((patient) => patient._id === invoice.patientId),
    [patients, invoice.patientId]
  );

  useEffect(() => {
    if (selectedPatient && selectedPatient.name && selectedPatient.name !== invoice.patientName) {
      setInvoice((current) => ({ ...current, patientName: selectedPatient.name }));
    }
  }, [selectedPatient, invoice.patientName]);

  const selectedAppointment = appointments.find(
    (appointment) => appointment._id === selectedAppointmentId
  );
  const selectedLabRequest = laboratoryRequests.find(
    (request) => request._id === selectedLaboratoryId
  );
  const selectedMedicine = medicines.find((medicine) => medicine._id === selectedMedicineId);

  const setInvoicePatient = (patientId: string) => {
    const patient = patients.find((item) => item._id === patientId);

    setInvoice({
      ...invoice,
      patientId,
      patientName: patient?.name ?? invoice.patientName
    });
  };

  const handleAppointmentSelection = (appointmentId: string) => {
    setSelectedAppointmentId(appointmentId);

    const appointment = appointments.find((item) => item._id === appointmentId);
    if (!appointment) {
      return;
    }

    setInvoicePatient(appointment.patientId);
  };

  const handleLaboratorySelection = (laboratoryId: string) => {
    setSelectedLaboratoryId(laboratoryId);

    const laboratory = laboratoryRequests.find((item) => item._id === laboratoryId);
    if (!laboratory) {
      return;
    }

    const patientId =
      typeof laboratory.patient === "string" ? laboratory.patient : laboratory.patient._id;
    const patientName =
      typeof laboratory.patient === "string" ? undefined : laboratory.patient.name;

    setInvoice({
      ...invoice,
      patientId: patientId ?? invoice.patientId,
      patientName: patientName ?? invoice.patientName
    });
  };

  const addAppointmentItem = () => {
    if (!selectedAppointment) return;
    const description = `Consultation - ${selectedAppointment.reason ?? selectedAppointment._id}`;
    setInvoice({
      ...invoice,
      items: [
        ...items,
        { description, quantity: 1, unitPrice: 0, amount: 0, category: "Appointment" }
      ]
    });
  };

  const addLaboratoryItem = () => {
    if (!selectedLabRequest) return;
    const description = `Lab request - ${selectedLabRequest.testName}`;
    setInvoice({
      ...invoice,
      items: [
        ...items,
        { description, quantity: 1, unitPrice: 0, amount: 0, category: "Laboratory" }
      ]
    });
  };

  const addMedicineItem = () => {
    if (!selectedMedicine) return;

    const quantity = Math.max(1, medicineQuantity);
    setInvoice({
      ...invoice,
      items: [
        ...items,
        {
          description: selectedMedicine.name,
          quantity,
          unitPrice: selectedMedicine.price,
          amount: selectedMedicine.price * quantity,
          category: selectedMedicine.category
        }
      ]
    });

    setSelectedMedicineId("");
    setMedicineQuantity(1);
  };

  const subtotal = useMemo(
    () => items.reduce((total, item) => total + item.quantity * item.unitPrice, 0),
    [items]
  );

  const totalAmount = subtotal;
  const paidAmount = invoice.paidAmount ?? 0;
  const balance = Math.max(totalAmount - paidAmount, 0);

  const updateItem = (index: number, field: keyof InvoiceLineItem, value: string | number) => {
    const nextItems = [...items];
    const item = nextItems[index] ?? { ...defaultLineItem };
    nextItems[index] = {
      ...item,
      [field]: value,
      amount:
        field === "quantity"
          ? Number(value) * item.unitPrice
          : field === "unitPrice"
            ? item.quantity * Number(value)
            : item.amount
    } as InvoiceLineItem;
    setInvoice({ ...invoice, items: nextItems });
  };

  const addItem = () => {
    setInvoice({ ...invoice, items: [...items, { ...defaultLineItem }] });
  };

  const removeItem = (index: number) => {
    setInvoice({ ...invoice, items: items.filter((_, itemIndex) => itemIndex !== index) });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload: CreateInvoice = {
      invoiceNumber: invoice.invoiceNumber?.trim() || undefined,
      patientId: invoice.patientId?.trim() ?? "",
      patientName: invoice.patientName?.trim(),
      items: items.map((item) => ({
        description: item.description.trim(),
        category: item.category?.trim(),
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        amount: item.quantity * item.unitPrice
      })),
      paidAmount,
      status: invoice.status ?? "draft",
      paymentMethod: invoice.paymentMethod?.trim(),
      notes: invoice.notes?.trim(),
      dueDate: invoice.dueDate ? invoice.dueDate : undefined
    };

    if (invoiceId) {
      await updateMutation.mutateAsync({ id: invoiceId, data: payload });
    } else {
      await createMutation.mutateAsync(payload);
    }

    onSuccess?.();
    navigate("/app/billing");
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border bg-white p-6 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Invoice Number</label>
          <input
            value={invoice.invoiceNumber ?? ""}
            onChange={(event) => setInvoice({ ...invoice, invoiceNumber: event.target.value })}
            className="w-full rounded-md border px-3 py-2"
            placeholder="INV-1234"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Patient</label>
          <select
            value={invoice.patientId ?? ""}
            onChange={(event) => setInvoicePatient(event.target.value)}
            className="w-full rounded-md border px-3 py-2"
            required
          >
            <option value="">Select patient</option>
            {patients.map((patient) => (
              <option key={patient._id} value={patient._id}>
                {patient.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Patient ID</label>
          <input
            value={invoice.patientId ?? ""}
            readOnly
            className="w-full rounded-md border bg-slate-100 px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Patient Name</label>
          <input
            value={invoice.patientName ?? ""}
            onChange={(event) => setInvoice({ ...invoice, patientName: event.target.value })}
            className="w-full rounded-md border px-3 py-2"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Appointment</label>
          <div className="flex gap-2">
            <select
              value={selectedAppointmentId}
              onChange={(event) => handleAppointmentSelection(event.target.value)}
              className="w-full rounded-md border px-3 py-2"
            >
              <option value="">Select appointment</option>
              {appointments.map((appointment) => (
                <option key={appointment._id} value={appointment._id}>
                  {appointment.patientId} -{" "}
                  {new Date(appointment.appointmentDate).toLocaleDateString()}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={addAppointmentItem}
              disabled={!selectedAppointmentId}
              className="rounded-md bg-secondary px-3 py-2 text-white"
            >
              Add
            </button>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Lab Request</label>
          <div className="flex gap-2">
            <select
              value={selectedLaboratoryId}
              onChange={(event) => handleLaboratorySelection(event.target.value)}
              className="w-full rounded-md border px-3 py-2"
            >
              <option value="">Select lab request</option>
              {laboratoryRequests.map((request) => (
                <option key={request._id} value={request._id}>
                  {request.testName} ({request.status})
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={addLaboratoryItem}
              disabled={!selectedLaboratoryId}
              className="rounded-md bg-secondary px-3 py-2 text-white"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm font-medium">Medicine</label>
          <select
            value={selectedMedicineId}
            onChange={(event) => setSelectedMedicineId(event.target.value)}
            className="w-full rounded-md border px-3 py-2"
          >
            <option value="">Select medicine</option>
            {medicines.map((medicine) => (
              <option key={medicine._id} value={medicine._id}>
                {medicine.name} - ${medicine.price.toFixed(2)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Quantity</label>
          <input
            type="number"
            min={1}
            value={medicineQuantity}
            onChange={(event) => setMedicineQuantity(Number(event.target.value))}
            className="w-full rounded-md border px-3 py-2"
          />
        </div>

        <div className="flex items-end">
          <button
            type="button"
            onClick={addMedicineItem}
            disabled={!selectedMedicineId}
            className="w-full rounded-md bg-secondary px-3 py-2 text-white"
          >
            Add Medicine
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Patient Name</label>
          <input
            value={invoice.patientName ?? ""}
            onChange={(event) => setInvoice({ ...invoice, patientName: event.target.value })}
            className="w-full rounded-md border px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Due Date</label>
          <input
            type="date"
            value={invoice.dueDate ?? ""}
            onChange={(event) => setInvoice({ ...invoice, dueDate: event.target.value })}
            className="w-full rounded-md border px-3 py-2"
          />
        </div>
      </div>

      <div className="space-y-4 rounded-lg border bg-gray-50 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Line Items</h2>
          <button
            type="button"
            onClick={addItem}
            className="rounded-md bg-primary px-3 py-2 text-white"
          >
            Add Item
          </button>
        </div>

        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={`${item.description}-${index}`} className="rounded-lg border bg-white p-4">
              <div className="mb-3 flex items-center justify-between gap-4">
                <p className="font-medium">Item {index + 1}</p>
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="text-sm text-red-600"
                >
                  Remove
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-1 block text-sm font-medium">Description</label>
                  <input
                    value={item.description}
                    onChange={(event) => updateItem(index, "description", event.target.value)}
                    className="w-full rounded-md border px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Quantity</label>
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(event) => updateItem(index, "quantity", Number(event.target.value))}
                    className="w-full rounded-md border px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Unit Price</label>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={item.unitPrice}
                    onChange={(event) => updateItem(index, "unitPrice", Number(event.target.value))}
                    className="w-full rounded-md border px-3 py-2"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 mt-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">Category</label>
                  <input
                    value={item.category ?? ""}
                    onChange={(event) => updateItem(index, "category", event.target.value)}
                    className="w-full rounded-md border px-3 py-2"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Amount</label>
                  <input
                    type="number"
                    value={item.quantity * item.unitPrice}
                    readOnly
                    className="w-full rounded-md border bg-slate-100 px-3 py-2"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-gray-50 p-4">
          <p className="text-sm text-muted-foreground">Subtotal</p>
          <p className="mt-2 text-xl font-semibold">${subtotal.toFixed(2)}</p>
        </div>
        <div className="rounded-lg border bg-gray-50 p-4">
          <p className="text-sm text-muted-foreground">Paid Amount</p>
          <input
            type="number"
            min={0}
            step="0.01"
            value={paidAmount}
            onChange={(event) => setInvoice({ ...invoice, paidAmount: Number(event.target.value) })}
            className="mt-2 w-full rounded-md border px-3 py-2"
          />
        </div>
        <div className="rounded-lg border bg-gray-50 p-4">
          <p className="text-sm text-muted-foreground">Balance</p>
          <p className="mt-2 text-xl font-semibold">${balance.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Payment Method</label>
          <input
            value={invoice.paymentMethod ?? ""}
            onChange={(event) => setInvoice({ ...invoice, paymentMethod: event.target.value })}
            className="w-full rounded-md border px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Status</label>
          <select
            value={invoice.status ?? "draft"}
            onChange={(event) =>
              setInvoice({ ...invoice, status: event.target.value as Invoice["status"] })
            }
            className="w-full rounded-md border px-3 py-2"
          >
            <option value="draft">Draft</option>
            <option value="unpaid">Unpaid</option>
            <option value="part_paid">Part Paid</option>
            <option value="paid">Paid</option>
            <option value="refunded">Refunded</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Notes</label>
        <textarea
          value={invoice.notes ?? ""}
          onChange={(event) => setInvoice({ ...invoice, notes: event.target.value })}
          className="w-full rounded-md border px-3 py-2"
          rows={4}
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-primary px-5 py-2 text-white"
      >
        {isPending ? "Saving..." : invoiceId ? "Update Invoice" : "Create Invoice"}
      </button>
    </form>
  );
}
