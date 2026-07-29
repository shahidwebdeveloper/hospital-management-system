import { Types } from "mongoose";

import { Laboratory } from "./laboratory-model.js";
import type {
  CreateLaboratoryInput,
  LaboratoryResultInput,
  UpdateLaboratoryStatusInput
} from "./laboratory-validation.js";

export class LaboratoryService {
  static async createLaboratoryRequest(data: CreateLaboratoryInput) {
    return await Laboratory.create({
      ...data,
      requestedAt: new Date(),
      status: "requested"
    });
  }

  static async getAllRequests() {
    return await Laboratory.find().populate("patient").populate("doctor").sort({ createdAt: -1 });
  }

  static async getQueue() {
    return await Laboratory.find({
      status: {
        $in: ["requested", "sample_collected", "processing"]
      }
    })
      .populate("patient")
      .populate("doctor")
      .sort({ priority: -1, createdAt: 1 });
  }

  static async getRequestById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid laboratory request id.");
    }

    return await Laboratory.findById(id).populate("patient").populate("doctor");
  }

  static async updateStatus(id: string, data: UpdateLaboratoryStatusInput) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid laboratory request id.");
    }

    const updateData: Record<string, unknown> = {
      status: data.status
    };

    if (data.status === "sample_collected") {
      updateData.sampleCollectedAt = new Date();
    }

    if (data.status === "completed") {
      updateData.completedAt = new Date();
    }

    return await Laboratory.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });
  }

  static async enterResult(id: string, data: LaboratoryResultInput) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid laboratory request id.");
    }

    return await Laboratory.findByIdAndUpdate(
      id,
      {
        ...data,
        status: "completed",
        completedAt: new Date()
      },
      {
        new: true,
        runValidators: true
      }
    );
  }

  static async cancelRequest(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid laboratory request id.");
    }

    return await Laboratory.findByIdAndUpdate(
      id,
      {
        status: "cancelled"
      },
      {
        new: true,
        runValidators: true
      }
    );
  }

  static async deleteRequest(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid laboratory request id.");
    }

    return await Laboratory.findByIdAndDelete(id);
  }
}
