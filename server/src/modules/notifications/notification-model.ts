import mongoose, { Schema, type InferSchemaType } from "mongoose";

const notificationSchema = new Schema(
  {
    recipientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true
    },
    subject: {
      type: String,
      required: true,
      trim: true
    },
    message: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ["system", "appointment", "prescription", "lab", "billing", "patient", "task"],
      default: "system",
      index: true
    },
    targetType: {
      type: String,
      enum: ["patient", "appointment", "prescription", "invoice", "lab", "user", "system"],
      default: "system",
      index: true
    },
    targetId: {
      type: Schema.Types.ObjectId,
      index: true
    },
    status: {
      type: String,
      enum: ["unread", "read", "archived"],
      default: "unread",
      index: true
    },
    readAt: {
      type: Date,
      index: true
    }
  },
  {
    timestamps: true
  }
);

notificationSchema.index({ recipientId: 1, status: 1, createdAt: -1 });
notificationSchema.index({ targetType: 1, targetId: 1 });

export type Notification = InferSchemaType<typeof notificationSchema>;
export const NotificationModel = mongoose.model("Notification", notificationSchema);
