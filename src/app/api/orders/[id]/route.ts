import { Order } from "@/model/order";
import { sendRJResponse } from "@/utils/api";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id: orderId } = await params;
        const order = await Order.findById(orderId).populate("items.item");
        
        if (!order) {
            return sendRJResponse({ success: false, message: "Order not found", status: 404 });
        }

        return sendRJResponse({ success: true, status: 200, data: order, message: "" });
    } catch (error) {
        console.error("Error getting order:", error);
        return sendRJResponse({ success: false, message: "Internal server error", status: 500 });
    }
}
