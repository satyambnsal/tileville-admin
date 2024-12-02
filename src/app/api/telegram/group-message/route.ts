import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/middleware/adminAuth";
import { getBot } from "@/lib/telegram";

interface GroupMessageRequest {
  message: string;
}

async function handler(req: NextRequest) {
  try {
    const { message } = (await req.json()) as GroupMessageRequest;

    if (!message) {
      return NextResponse.json(
        { error: "Message content is required" },
        { status: 400 }
      );
    }

    const bot = getBot();
    const groupId = process.env.TELEGRAM_GROUP_ID;
    const topicId = process.env.TELEGRAM_DEMO_GAME_TOPIC_ID;

    if (!groupId) {
      return NextResponse.json(
        { error: "Telegram group ID not configured" },
        { status: 500 }
      );
    }

    // Send message to the specific topic in the group
    await bot.sendGroupMessage(
      groupId,
      message,
      topicId ? parseInt(topicId) : undefined
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending group message:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}

export const POST = adminAuth(handler);
