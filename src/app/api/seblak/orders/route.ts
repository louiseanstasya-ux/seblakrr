import { NextRequest, NextResponse } from "next/server";
import mongoServer from "@/config/mongoConfig";
import { SeblakOrder } from "@/model/seblakOrder";

export const dynamic = "force-dynamic";

// GET — ambil semua pesanan (untuk admin) atau pesanan by antrian (untuk user)
export async function GET(req: NextRequest) {
  try {
    await mongoServer();
    const { searchParams } = new URL(req.url);
    const antrian = searchParams.get("antrian");

    if (antrian) {
      const order = await SeblakOrder.findOne({ antrian }).sort({ createdAt: -1 });
      return NextResponse.json({ success: true, data: order });
    }

    const id = searchParams.get("id");
    if (id) {
      const order = await SeblakOrder.findById(id);
      return NextResponse.json({ success: true, data: order });
    }

    const orders = await SeblakOrder.find().sort({ createdAt: -1 }).limit(100);
    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Error" }, { status: 500 });
  }
}

// POST — buat pesanan baru (dari user)
export async function POST(req: NextRequest) {
  try {
    await mongoServer();
    const body = await req.json();

    // Generate nomor antrian 3 digit
    const count = await SeblakOrder.countDocuments();
    const antrian = String((count % 900) + 100);

    const order = await SeblakOrder.create({
      antrian,
      nama:         body.nama,
      items:        body.items,
      subtotal:     body.subtotal,
      grandTotal:   body.grandTotal,
      diskonPoin:   body.diskonPoin ?? 0,
      status:       "MASUK",
      paymentStatus: "UNPAID",
    });

    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Error creating order" }, { status: 500 });
  }
}

// PUT — update status pesanan (dari admin)
export async function PUT(req: NextRequest) {
  try {
    await mongoServer();
    const body = await req.json();
    const { id, status, paymentStatus, estimasi, catatanTolak } = body;

    const updateData: Record<string, unknown> = {};
    if (status)        updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (estimasi)      updateData.estimasi = estimasi;
    if (catatanTolak !== undefined) updateData.catatanTolak = catatanTolak;

    const order = await SeblakOrder.findByIdAndUpdate(id, updateData, { new: true });
    if (!order) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });

    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Error updating order" }, { status: 500 });
  }
}
