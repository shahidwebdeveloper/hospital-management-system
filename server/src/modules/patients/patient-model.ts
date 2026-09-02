import mongoose, { Schema, type InferSchemaType } from "mongoose";

const emergencyContactSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    phone: {
      type: String,
      required: true,
      trim: true
    },

    relationship: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    _id: false
  }
);

const patientSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      sparse: true,
      index: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    phone: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      index: true,
      sparse: true
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true
    },

    dateOfBirth: {
      type: Date,
      index: true
    },

    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
    },

    address: {
      type: String,
      trim: true
    },

    emergencyContact: emergencyContactSchema,

    allergies: {
      type: [String],
      default: []
    },

    medicalHistory: {
      type: [String],
      default: []
    },

    status: {
      type: String,
      enum: ["registered", "admitted", "discharged"],
      default: "registered",
      required: true,
      index: true
    }
  },
  {
    timestamps: true
  }
);

patientSchema.index({ email: 1, userId: 1 }, { unique: true, sparse: true });
patientSchema.index({ status: 1, createdAt: -1 });

export type Patient = InferSchemaType<typeof patientSchema>;

export const PatientModel = mongoose.model("Patient", patientSchema);
