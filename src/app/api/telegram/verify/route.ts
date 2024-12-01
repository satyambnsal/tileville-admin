import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/middleware/adminAuth";
import { getBot } from "@/lib/telegram";

async function handler(req: NextRequest) {
  try {
    const { chatId } = await req.json();
    if (!chatId) {
      return NextResponse.json({ error: "Missing chat ID" }, { status: 400 });
    }

    const bot = getBot();
    await bot.sendDirectMessage(
      chatId,
      `✅ *Successfully Connected!*\n\nYou'll receive updates about:\n• New competitions\n• Competition results\n• When someone follows you\n• Game updates\n• Important announcements\n\nUse /status to check your current settings.`
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export const POST = adminAuth(handler);
