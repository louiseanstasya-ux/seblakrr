import { NextRequest, NextResponse } from "next/server";
import { uploadToCloudinary } from "@/service/cloudnary";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, message: "Tidak ada file" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ success: false, message: "Hanya file gambar yang diizinkan" }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ success: false, message: "Ukuran file maksimal 5MB" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const imageUrl = await uploadToCloudinary(buffer, "seblakrr/menu");

    return NextResponse.json({ success: true, url: imageUrl });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ success: false, message: "Gagal upload gambar" }, { status: 500 });
  }
}
