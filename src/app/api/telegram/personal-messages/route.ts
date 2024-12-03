import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/middleware/adminAuth";
import { getBot } from "@/lib/telegram";

interface PersonalMessageRequest {
  message: string;
  chatIds: string[];
}

async function handler(req: NextRequest) {
  try {
    const { message, chatIds } = (await req.json()) as PersonalMessageRequest;

    if (!message || !chatIds || chatIds.length === 0) {
      return NextResponse.json(
        { error: "Message content and chat IDs are required" },
        { status: 400 }
      );
    }

    const bot = getBot();

    // Send message to each chat ID
    const results = await Promise.allSettled(
      chatIds.map((chatId) => bot.sendDirectMessage(chatId, message))
    );

    const succeeded = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;

    return NextResponse.json({
      success: true,
      summary: {
        total: chatIds.length,
        succeeded,
        failed,
      },
    });
  } catch (error) {
    console.error("Error sending personal messages:", error);
    return NextResponse.json(
      { error: "Failed to send messages" },
      { status: 500 }
    );
  }
}

export const POST = adminAuth(handler);
