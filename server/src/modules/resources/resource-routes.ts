import { Router } from "express";
import { z } from "zod";

import { apiResponse } from "../../utils/api-response.js";
import {
  applicationRules,
  resourceDefinitionMap,
  resourceDefinitions,
  type ResourceKey
} from "./resource-definitions.js";
import { getResourceModel } from "./resource-model.js";

const resourceKeySchema = z.enum([
  "departments",
  "doctors",
  "patients",
  "appointments",
  "medical-records",
  "prescriptions",
  "laboratory",
  "pharmacy",
  "billing",
  "notifications"
]);

const resourcePayloadSchema = z.object({
  title: z.string().min(2).max(160),
  status: z.string().min(2).max(60),
  summary: z.string().max(1200).optional(),
  owner: z.string().max(160).optional(),
  priority: z.enum(["low", "normal", "high", "urgent"]).default("normal"),
  scheduledAt: z.coerce.date().optional(),
  amount: z.coerce.number().min(0).optional(),
  tags: z.array(z.string().min(1).max(40)).default([]),
  data: z.record(z.unknown()).default({}),
  audit: z
    .object({
      createdBy: z.string().optional(),
      updatedBy: z.string().optional()
    })
    .default({})
});

const updatePayloadSchema = resourcePayloadSchema.partial();

import { authorizeResource } from "../../middlewares/authorize.js";

export const resourceRouter = Router();

function parseResourceKey(value: string): ResourceKey {
  return resourceKeySchema.parse(value);
}

resourceRouter.get("/rules", (_req, res) => {
  res.json(
    apiResponse({
      roles: resourceDefinitions.reduce<Record<string, string[]>>((acc, definition) => {
        acc[definition.key] = definition.allowedRoles;
        return acc;
      }, {}),
      modules: resourceDefinitions,
      rules: applicationRules
    })
  );
});

resourceRouter.get("/:resource", authorizeResource(), async (req, res, next) => {
  try {
    const key = parseResourceKey(String(req.params.resource ?? ""));
    const definition = resourceDefinitionMap.get(key)!;
    const model = getResourceModel(key);
    const page = Math.max(Number(req.query.page ?? 1), 1);
    const limit = Math.min(Math.max(Number(req.query.limit ?? 20), 1), 100);
    const search = String(req.query.search ?? "").trim();
    const status = String(req.query.status ?? "").trim();

    const filters: Record<string, unknown> = {};

    if (status) {
      filters.status = status;
    }

    if (search) {
      filters.$or = [
        { title: { $regex: search, $options: "i" } },
        { summary: { $regex: search, $options: "i" } },
        { owner: { $regex: search, $options: "i" } },
        ...definition.searchableFields.map((field) => ({
          [`data.${field}`]: { $regex: search, $options: "i" }
        }))
      ];
    }

    const [items, total] = await Promise.all([
      model
        .find(filters)
        .sort({ updatedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      model.countDocuments(filters)
    ]);

    res.json(
      apiResponse({
        module: definition,
        items,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      })
    );
  } catch (error) {
    next(error);
  }
});

resourceRouter.post("/:resource", authorizeResource(), async (req, res, next) => {
  try {
    const key = parseResourceKey(String(req.params.resource ?? ""));
    const definition = resourceDefinitionMap.get(key)!;
    const payload = resourcePayloadSchema.parse(req.body);

    if (!definition.statuses.includes(payload.status)) {
      return res
        .status(400)
        .json({
          success: false,
          message: `Invalid status for ${definition.displayName}. Allowed: ${definition.statuses.join(", ")}`,
          data: null
        });
    }

    const model = getResourceModel(key);
    const item = await model.create(payload);

    res.status(201).json(apiResponse(item));
  } catch (error) {
    next(error);
  }
});

resourceRouter.get("/:resource/stats/summary", authorizeResource(), async (req, res, next) => {
  try {
    const key = parseResourceKey(String(req.params.resource ?? ""));
    const definition = resourceDefinitionMap.get(key)!;
    const model = getResourceModel(key);
    const byStatus = await model.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]);
    const total = byStatus.reduce((sum, item) => sum + item.count, 0);

    res.json(
      apiResponse({
        module: definition.displayName,
        total,
        byStatus
      })
    );
  } catch (error) {
    next(error);
  }
});

resourceRouter.get("/:resource/:id", authorizeResource(), async (req, res, next) => {
  try {
    const key = parseResourceKey(String(req.params.resource ?? ""));
    const model = getResourceModel(key);
    const item = await model.findById(req.params.id).lean();

    if (!item) {
      return res.status(404).json({ success: false, message: "Record not found", data: null });
    }

    res.json(apiResponse(item));
  } catch (error) {
    next(error);
  }
});

resourceRouter.patch("/:resource/:id", authorizeResource(), async (req, res, next) => {
  try {
    const key = parseResourceKey(String(req.params.resource ?? ""));
    const definition = resourceDefinitionMap.get(key)!;
    const payload = updatePayloadSchema.parse(req.body);

    if (payload.status && !definition.statuses.includes(payload.status)) {
      return res
        .status(400)
        .json({
          success: false,
          message: `Invalid status for ${definition.displayName}. Allowed: ${definition.statuses.join(", ")}`,
          data: null
        });
    }

    const model = getResourceModel(key);
    const item = await model.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true
    });

    if (!item) {
      return res.status(404).json({ success: false, message: "Record not found", data: null });
    }

    res.json(apiResponse(item));
  } catch (error) {
    next(error);
  }
});

resourceRouter.delete("/:resource/:id", authorizeResource(), async (req, res, next) => {
  try {
    const key = parseResourceKey(String(req.params.resource ?? ""));
    const model = getResourceModel(key);
    const item = await model.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, message: "Record not found", data: null });
    }

    res.json(apiResponse({ deleted: true }));
  } catch (error) {
    next(error);
  }
});
