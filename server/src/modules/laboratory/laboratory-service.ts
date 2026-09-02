import { Types } from "mongoose";

import { Laboratory } from "./laboratory-model.js";
import type {
  CreateLaboratoryInput,
  LaboratoryResultInput,
  UpdateLaboratoryStatusInput
} from "./laboratory-validation.js";

const allowedTransitions: Record<string, string[]> = {
  requested: ["sample_collected", "cancelled"],
  sample_collected: ["processing", "cancelled"],
  processing: ["completed", "cancelled"],
  completed: [],
  cancelled: []
};

export class LaboratoryService {
  static canTransitionStatus(currentStatus: string, nextStatus: string) {
    return allowedTransitions[currentStatus]?.includes(nextStatus) ?? false;
  }

  static async createLaboratoryRequest(data: CreateLaboratoryInput) {
    return await Laboratory.create({
      ...data,
      requestedAt: new Date(),
      status: "requested"
    });
  }

  static async getAllRequests(scope: Record<string, unknown> = {}) {
    return await Laboratory.find(scope)
      .populate("patient")
      .populate("doctor")
      .sort({ createdAt: -1 });
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

    const request = await Laboratory.findById(id);
    if (!request) {
      return null;
    }

    if (!LaboratoryService.canTransitionStatus(request.status, data.status)) {
      throw new Error(`Status transition from ${request.status} to ${data.status} is not allowed.`);
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

    const request = await Laboratory.findById(id);
    if (!request) {
      return null;
    }

    if (request.status === "completed") {
      throw new Error("A finalized laboratory result cannot be overwritten.");
    }

    return await Laboratory.findByIdAndUpdate(
      id,
      {
        ...data,
        status: "completed",
        completedAt: new Date(),
        resultFinalizedAt: new Date()
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
