// src/app/api/telegram/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getBot } from "@/lib/telegram";

export async function POST(req: NextRequest) {
  try {
    const update = await req.json();
    const bot = getBot();

    await bot.handleUpdate(update);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
