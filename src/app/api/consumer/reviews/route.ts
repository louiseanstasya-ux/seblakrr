import { NextRequest } from "next/server";
import { Review } from "@/model/review";
import { Merchants } from "@/model/merchants";
import { sendRJResponse } from "@/utils/api";
import mongoServer from "@/config/mongoConfig";

export async function POST(req: NextRequest) {
  try {
    await mongoServer();
    const body = await req.json();
    const { userId, merchantId, orderId, rating, comment } = body;

    if (!userId || !merchantId || !orderId || !rating) {
      return sendRJResponse({ success: false, status: 400, message: "Missing required fields" });
    }

    // Check if review already exists for this order
    const existingReview = await Review.findOne({ orderId }).lean();
    if (existingReview) {
      return sendRJResponse({ success: false, status: 400, message: "Review already submitted for this order" });
    }

    const review = await Review.create({
      userId,
      merchantId,
      orderId,
      rating,
      comment
    });

    // Reward user with 50 points for reviewing
    await Merchants.findByIdAndUpdate(userId, { $inc: { points: 50 } });

    return sendRJResponse({ success: true, status: 200, data: review, message: "Review submitted successfully" });
  } catch (error) {
    console.error("Error submitting review:", error);
    return sendRJResponse({ success: false, status: 500, message: "Internal server error" });
  }
}
