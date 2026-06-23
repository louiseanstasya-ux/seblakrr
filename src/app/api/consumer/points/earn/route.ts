import { NextRequest } from "next/server";
import { Merchants } from "@/model/merchants";
import { sendRJResponse } from "@/utils/api";
import mongoServer from "@/config/mongoConfig";

export async function POST(req: NextRequest) {
  try {
    await mongoServer();
    const body = await req.json();
    const { userId, points } = body;

    if (!userId || typeof points !== "number") {
      return sendRJResponse({ success: false, status: 400, message: "Missing or invalid userId or points" });
    }

    const user = await Merchants.findByIdAndUpdate(
      userId,
      { $inc: { points: points } },
      { new: true }
    ).lean();

    if (!user) {
      return sendRJResponse({ success: false, status: 404, message: "User not found" });
    }

    return sendRJResponse({ success: true, status: 200, data: { points: user.points }, message: "Points added" });
  } catch (error) {
    console.error("Error adding points:", error);
    return sendRJResponse({ success: false, status: 500, message: "Internal server error" });
  }
}
