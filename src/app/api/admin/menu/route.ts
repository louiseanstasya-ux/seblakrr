import { Menu } from "@/model/menu";
import { sendRJResponse } from "@/utils/api";
import mongoServer from "@/config/mongoConfig";
import { Types } from "mongoose";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    try {
        await mongoServer();
        const menus = await Menu.find().sort({ createdAt: -1 });
        return sendRJResponse({ success: true, status: 200, data: menus, message: "" });
    } catch (error) {
        return sendRJResponse({ success: false, message: "Error fetching menus", status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await mongoServer();
        const body = await req.json();
        const merchantId = new Types.ObjectId("60f7b3b3b3b3b3b3b3b3b3b3");
        const menu = await Menu.create({
            ...body,
            merchantId,
            image: body.image || "/menu-images/seblak.png",
            quantity: body.quantity ?? 100
        });
        return sendRJResponse({ success: true, status: 201, data: menu, message: "Menu created" });
    } catch (error) {
        console.error("Create menu error:", error);
        return sendRJResponse({ success: false, message: "Error creating menu", status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        await mongoServer();
        const body = await req.json();
        const { id, ...updateData } = body;
        const menu = await Menu.findByIdAndUpdate(id, updateData, { new: true });
        if (!menu) return sendRJResponse({ success: false, message: "Menu not found", status: 404 });
        return sendRJResponse({ success: true, status: 200, data: menu, message: "Menu updated" });
    } catch (error) {
        return sendRJResponse({ success: false, message: "Error updating menu", status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        await mongoServer();
        const body = await req.json();
        const { id } = body;
        await Menu.findByIdAndDelete(id);
        return sendRJResponse({ success: true, status: 200, data: null, message: "Menu deleted" });
    } catch (error) {
        return sendRJResponse({ success: false, message: "Error deleting menu", status: 500 });
    }
}
