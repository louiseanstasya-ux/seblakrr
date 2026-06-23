import { Order } from "@/model/order";
import { SeblakOrder } from "@/model/seblakOrder";
import { sendRJResponse } from "@/utils/api";
import mongoServer from "@/config/mongoConfig";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    try {
        await mongoServer();
        const orders = await SeblakOrder.find().sort({ createdAt: -1 });
        return sendRJResponse({ success: true, status: 200, data: orders, message: "" });
    } catch (error) {
        console.error("Error getting all admin orders:", error);
        return sendRJResponse({ success: false, message: "Internal server error", status: 500 });
    }
}
