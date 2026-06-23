import mongoose from "mongoose";

export interface IRewardRedemption {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    merchantId: mongoose.Types.ObjectId;
    rewardId: mongoose.Types.ObjectId;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

const rewardRedemptionSchema = new mongoose.Schema<IRewardRedemption>({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "merchants" },
    merchantId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "merchants" },
    rewardId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "rewards" },
    status: { type: String, enum: ["PENDING", "FULFILLED"], default: "PENDING" },
}, { timestamps: true });

export const RewardRedemption = mongoose.models.reward_redemptions || mongoose.model<IRewardRedemption>("reward_redemptions", rewardRedemptionSchema);
