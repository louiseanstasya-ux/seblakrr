import { NextRequest } from "next/server";
import { Reward } from "@/model/reward";
import { RewardRedemption } from "@/model/reward-redemption";
import { Merchants } from "@/model/merchants";
import { sendRJResponse } from "@/utils/api";
import mongoServer from "@/config/mongoConfig";

export async function GET(req: NextRequest) {
  try {
    await mongoServer();
    const params = req.nextUrl.searchParams;
    const merchantId = params.get("merchantId");
    
    const query = merchantId ? { merchantId } : {};
    const rewards = await Reward.find(query).lean();

    return sendRJResponse({ success: true, status: 200, data: rewards, message: "Rewards fetched" });
  } catch (error) {
    console.error("Error fetching rewards:", error);
    return sendRJResponse({ success: false, status: 500, message: "Internal server error" });
  }
}

export async function POST(req: NextRequest) {
  try {
    await mongoServer();
    const body = await req.json();
    const { userId, merchantId, rewardId } = body;

    if (!userId || !merchantId || !rewardId) {
      return sendRJResponse({ success: false, status: 400, message: "Missing required fields" });
    }

    const reward = await Reward.findById(rewardId).lean();
    if (!reward) {
      return sendRJResponse({ success: false, status: 404, message: "Reward not found" });
    }

    const user = await Merchants.findById(userId).lean();
    if (!user || user.points < reward.pointCost) {
      return sendRJResponse({ success: false, status: 400, message: "Insufficient points" });
    }

    // Deduct points
    await Merchants.findByIdAndUpdate(userId, { $inc: { points: -reward.pointCost } });

    // Create redemption record
    const redemption = await RewardRedemption.create({
      userId,
      merchantId,
      rewardId,
      status: "PENDING"
    });

    return sendRJResponse({ success: true, status: 200, data: redemption, message: "Reward redeemed successfully" });
  } catch (error) {
    console.error("Error redeeming reward:", error);
    return sendRJResponse({ success: false, status: 500, message: "Internal server error" });
  }
}
