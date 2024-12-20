// src/app/api/notifications/route.ts
import { NextResponse } from "next/server";
import { getBot } from "@/lib/telegram";
import { NotificationType, NotificationContent } from "@/types/notifications";
import { supabaseServiceClient } from "@/db/config/server";

async function getChatIdForWallet(
  walletAddress: string
): Promise<string | null> {
  const { data, error } = await supabaseServiceClient
    .from("telegram_auth")
    .select("chat_id")
    .eq("wallet_address", walletAddress)
    .single();

  if (error || !data) {
    console.error("Error getting chat_id:", error);
    return null;
  }

  return data.chat_id;
}

export async function POST(req: Request) {
  try {
    const tilevilleBot = getBot();
    const { type, content, recipients } = (await req.json()) as {
      type: NotificationType;
      content: NotificationContent;
      recipients: string[];
    };

    const results = [];

    for (const recipient of recipients) {
      const chatId = await getChatIdForWallet(recipient);

      if (!chatId) {
        results.push({
          wallet: recipient,
          success: false,
          error: "No Telegram chat linked to this wallet",
        });
        continue;
      }

      try {
        switch (type) {
          case "competition":
            await tilevilleBot.notifyNewCompetition(chatId, {
              name: content.name!,
              entryFee: content.entryFee!,
              startTime: new Date(content.startTime!),
              prizePool: content.prizePool!,
            });
            break;

          case "announcement":
            await tilevilleBot.notifyAnnouncement(chatId, {
              title: content.title,
              message: content.message,
              priority: "normal",
            });
            break;

          case "maintenance":
            await tilevilleBot.notifyMaintenance(chatId, {
              title: content.title,
              message: content.message,
              startTime: content.startTime
                ? new Date(content.startTime)
                : undefined,
            });
            break;

          case "prize":
            await tilevilleBot.sendDirectMessage(
              chatId,
              `🏆 *Prize Notification*\n\n` +
                `Congratulations! You've won ${content.prizeAmount} MINA in the "${content.challengeName}" challenge.\n\n` +
                `Transaction Hash: \`${content.transactionHash}\`\n\n` +
                `The prize has been sent to your wallet. Thank you for participating!`
            );
            break;

          default:
            return NextResponse.json(
              { error: "Invalid notification type" },
              { status: 400 }
            );
        }

        results.push({
          wallet: recipient,
          success: true,
        });
      } catch (error) {
        results.push({
          wallet: recipient,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    return NextResponse.json({
      success: true,
      results,
    });
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "An unknown error occurred";
    console.error("Notification error:", err);

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
