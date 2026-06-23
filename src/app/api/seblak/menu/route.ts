import { NextRequest, NextResponse } from "next/server";
import mongoServer from "@/config/mongoConfig";
import { Menu } from "@/model/menu";
import { Types } from "mongoose";

export const dynamic = "force-dynamic";

const MERCHANT_ID = new Types.ObjectId("60f7b3b3b3b3b3b3b3b3b3b3");

// GET — ambil semua menu
export async function GET() {
  try {
    await mongoServer();
    const menus = await Menu.find({ merchantId: MERCHANT_ID }).sort({ section: 1, createdAt: -1 });
    return NextResponse.json({ success: true, data: menus });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Error" }, { status: 500 });
  }
}

// POST — tambah menu baru
export async function POST(req: NextRequest) {
  try {
    await mongoServer();
    const body = await req.json();
    const menu = await Menu.create({
      merchantId: MERCHANT_ID,
      title:         body.title,
      description:   body.description ?? "",
      price:         body.price,
      originalPrice: body.originalPrice,
      section:       body.section,
      image:         body.image || "/menu-images/seblak.png",
      quantity:      body.quantity ?? 100,
    });
    return NextResponse.json({ success: true, data: menu }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Error creating menu" }, { status: 500 });
  }
}

// PUT — edit menu
export async function PUT(req: NextRequest) {
  try {
    await mongoServer();
    const body = await req.json();
    const { id, ...updateData } = body;
    const menu = await Menu.findByIdAndUpdate(id, updateData, { new: true });
    if (!menu) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: menu });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error updating menu" }, { status: 500 });
  }
}

// DELETE — hapus menu
export async function DELETE(req: NextRequest) {
  try {
    await mongoServer();
    const body = await req.json();
    await Menu.findByIdAndDelete(body.id);
    return NextResponse.json({ success: true, message: "Deleted" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error deleting menu" }, { status: 500 });
  }
}
