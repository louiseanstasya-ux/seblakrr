import mongoose from "mongoose";

export interface ISeblakOrder {
  _id: mongoose.Types.ObjectId;
  antrian: string;
  nama: string;
  items: { title: string; quantity: number; price: number }[];
  subtotal: number;
  grandTotal: number;
  diskonPoin: number;
  status: "MASUK" | "DITERIMA" | "DIMASAK" | "SIAP" | "SELESAI" | "DITOLAK";
  paymentStatus: "UNPAID" | "PAID";
  estimasi?: number;
  catatanTolak?: string;
  createdAt: Date;
  updatedAt: Date;
}

const seblakOrderSchema = new mongoose.Schema<ISeblakOrder>(
  {
    antrian:      { type: String, required: true },
    nama:         { type: String, required: true, trim: true },
    items: [{
      title:    { type: String, required: true },
      quantity: { type: Number, required: true, min: 1 },
      price:    { type: Number, required: true, min: 0 },
    }],
    subtotal:     { type: Number, required: true, min: 0 },
    grandTotal:   { type: Number, required: true, min: 0 },
    diskonPoin:   { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["MASUK", "DITERIMA", "DIMASAK", "SIAP", "SELESAI", "DITOLAK"],
      default: "MASUK",
    },
    paymentStatus: {
      type: String,
      enum: ["UNPAID", "PAID"],
      default: "UNPAID",
    },
    estimasi:     { type: Number },
    catatanTolak: { type: String },
  },
  { timestamps: true, versionKey: false }
);

export const SeblakOrder =
  mongoose.models.seblakorders ||
  mongoose.model<ISeblakOrder>("seblakorders", seblakOrderSchema);
