import { NextRequest } from "next/server";
import { Order } from "@/model/order";
import { sendRJResponse } from "@/utils/api";
import mongoServer from "@/config/mongoConfig";

export async function GET(req: NextRequest, context: any) {
  try {
    await mongoServer();
    const params = await context.params;
    const { id } = params;

    const order = await Order.findById(id).lean();
    if (!order) {
      return sendRJResponse({ success: false, status: 404, message: "Order not found" });
    }

    return sendRJResponse({ success: true, status: 200, data: { status: order.status }, message: "Order status fetched" });
  } catch (error) {
    console.error("Error fetching order status:", error);
    return sendRJResponse({ success: false, status: 500, message: "Internal server error" });
  }
}

export async function PATCH(req: NextRequest, context: any) {
  try {
    await mongoServer();
    const params = await context.params;
    const { id } = params;
    const body = await req.json();
    const { status } = body;

    const allowedStatuses = ["RECEIVED", "COOKING", "READY", "COMPLETED"];
    if (!allowedStatuses.includes(status)) {
      return sendRJResponse({ success: false, status: 400, message: "Invalid status" });
    }

    const order = await Order.findByIdAndUpdate(id, { status }, { new: true }).lean();
    if (!order) {
      return sendRJResponse({ success: false, status: 404, message: "Order not found" });
    }

    return sendRJResponse({ success: true, status: 200, data: order, message: "Order status updated" });
  } catch (error) {
    console.error("Error updating order status:", error);
    return sendRJResponse({ success: false, status: 500, message: "Internal server error" });
  }
}
