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
    /**
     * Links the patient profile to the HMS User.
     */
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
      unique: true,
      sparse: true
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
      unique: true
    },

    email: {
      type: String,
      trim: true,
      lowercase: true
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true
    },

    dateOfBirth: {
      type: Date
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
      required: true
    }
  },
  {
    timestamps: true
  }
);

export type Patient = InferSchemaType<typeof patientSchema>;

export const PatientModel = mongoose.model("Patient", patientSchema);
