export type MedicineStatus = "in_stock" | "low_stock" | "out_of_stock" | "expired";

export interface Medicine {
  _id: string;
  name: string;
  category: string;
  stock: number;
  price: number;
  supplier: string;
  expiryDate: string;
  reorderLevel: number;
  status: MedicineStatus;
  lastRestockedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMedicine {
  name: string;
  category: string;
  stock: number;
  price: number;
  supplier: string;
  expiryDate: string;
  reorderLevel: number;
}

export interface UpdateMedicine extends Partial<CreateMedicine> {}
