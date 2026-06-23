import mongoose from "mongoose";

export interface IReward {
    _id: mongoose.Types.ObjectId;
    merchantId: mongoose.Types.ObjectId;
    name: string;
    pointCost: number;
    emoji: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}

const rewardSchema = new mongoose.Schema<IReward>({
    merchantId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "merchants" },
    name: { type: String, required: true },
    pointCost: { type: Number, required: true, min: 0 },
    emoji: { type: String, required: true },
    description: { type: String, required: true },
}, { timestamps: true });

export const Reward = mongoose.models.rewards || mongoose.model<IReward>("rewards", rewardSchema);
