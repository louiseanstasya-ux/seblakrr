import { NextRequest } from "next/server";
import { Merchants, IROLE } from "@/model/merchants";
import { sendRJResponse } from "@/utils/api";
import mongoServer from "@/config/mongoConfig";

export async function GET(req: NextRequest) {
  try {
    await mongoServer();

    // In a real scenario, you might filter by merchantId or just get top consumers generally.
    // Assuming the points are globally earned or per merchant context depending on setup.
    // For now, let's get top 10 consumers by points.
    const topConsumers = await Merchants.find({ role: IROLE.CONSUMER })
      .sort({ points: -1 })
      .limit(10)
      .select("name points")
      .lean();

    return sendRJResponse({ success: true, status: 200, data: topConsumers, message: "Leaderboard fetched" });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return sendRJResponse({ success: false, status: 500, message: "Internal server error" });
  }
}
