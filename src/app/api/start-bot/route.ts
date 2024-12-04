// src/app/api/start-bot/route.ts
import { NextResponse } from "next/server";
import { getBot } from "@/lib/telegram";

export async function POST() {
  try {
    const bot = getBot();
    await bot.start();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error starting bot:", error);
    return NextResponse.json({ error: "Failed to start bot" }, { status: 500 });
  }
}
