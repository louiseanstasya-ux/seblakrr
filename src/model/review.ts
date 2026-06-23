import mongoose from "mongoose";

export interface IReview {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    merchantId: mongoose.Types.ObjectId;
    orderId: mongoose.Types.ObjectId;
    rating: number;
    comment: string;
    createdAt: Date;
    updatedAt: Date;
}

const reviewSchema = new mongoose.Schema<IReview>({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "merchants" },
    merchantId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "merchants" },
    orderId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "orders" },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: false },
}, { timestamps: true });

export const Review = mongoose.models.reviews || mongoose.model<IReview>("reviews", reviewSchema);
