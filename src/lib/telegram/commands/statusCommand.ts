// src/lib/telegram/commands/statusCommand.ts

import { supabaseServiceClient } from "@/db/config/server";
import { Context } from "telegraf";

export const handleStatusCommand = () => {
  return async (ctx: Context) => {
    try {
      if (!ctx.chat) {
        console.error("Chat context not found");
        return;
      }

      const chatId = ctx.chat.id.toString();

      const { data: authData, error } = await supabaseServiceClient
        .from("telegram_auth")
        .select("*")
        .eq("chat_id", chatId)
        .single();

      if (error || !authData) {
        await ctx.reply(
          "❌ No Wallet Connected\n\n" +
            "You haven't linked a TileVille wallet yet.\n" +
            "Use /link to connect your wallet and start receiving notifications.\n\n" +
            "Need help? Use /help for more information.",
          { parse_mode: "HTML" }
        );
        return;
      }

      if (!authData.authenticated) {
        await ctx.reply(
          "⚠️ Wallet Verification Pending\n\n" +
            "Your wallet connection is not yet verified.\n" +
            "Please complete the verification process using the link provided in the /link command.\n\n" +
            "Need help? Use /help for more information.",
          { parse_mode: "HTML" }
        );
        return;
      }

      await ctx.reply(
        "📱 <b>Current Status</b>\n\n" +
          "<b>Linked Wallet:</b>\n" +
          `<code>${authData.wallet_address || "Not found"}</code>\n\n` +
          "<b>Verification Status:</b> ✅ Verified\n\n" +
          "<b>Notifications Enabled:</b>\n" +
          "✅ Competition announcements\n" +
          "✅ Competition results\n" +
          "✅ Game updates\n" +
          "✅ System maintenance\n" +
          "✅ Important announcements\n\n" +
          "Use /unlink to disconnect this wallet.",
        { parse_mode: "HTML" }
      );
    } catch (error) {
      console.error("Error in status command:", error);
      await ctx.reply(
        "⚠️ Error Checking Status\n\n" +
          "Sorry, there was an error checking your status. Please try again later.\n\n" +
          "If the problem persists:\n" +
          "• Check if the bot is working with /start\n" +
          "• Report the issue in our support channel\n" +
          "• Try again in a few minutes\n\n" +
          "Need help? Join our bug report channel: https://t.me/tilevilleBugs",
        {
          parse_mode: "HTML",
          link_preview_options: { is_disabled: true },
        }
      );
    }
  };
};
