import mongoose, { Schema } from "mongoose";

import { resourceDefinitions, type ResourceKey } from "./resource-definitions.js";

const auditSchema = new Schema(
  {
    createdBy: { type: String, trim: true },
    updatedBy: { type: String, trim: true }
  },
  { _id: false }
);

const resourceSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    status: { type: String, required: true, trim: true },
    summary: { type: String, trim: true },
    owner: { type: String, trim: true },
    priority: { type: String, enum: ["low", "normal", "high", "urgent"], default: "normal" },
    scheduledAt: { type: Date },
    amount: { type: Number, min: 0 },
    tags: [{ type: String, trim: true }],
    data: { type: Schema.Types.Mixed, default: {} },
    audit: { type: auditSchema, default: {} }
  },
  { timestamps: true, strict: true }
);

resourceSchema.index({ title: "text", summary: "text", owner: "text", status: "text" });

const models = new Map<ResourceKey, mongoose.Model<any>>();

export function getResourceModel(key: ResourceKey) {
  const existing = models.get(key);
  if (existing) return existing;

  const definition = resourceDefinitions.find((item) => item.key === key);

  if (!definition) {
    throw new Error(`Unknown resource: ${key}`);
  }

  const modelName = `Hospital${definition.collectionName}`;
  const model = (mongoose.models[modelName] ?? mongoose.model(modelName, resourceSchema, definition.collectionName)) as mongoose.Model<any>;
  models.set(key, model);

  return model;
}