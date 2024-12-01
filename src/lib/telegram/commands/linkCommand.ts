// src/lib/telegram/commands/linkCommand.ts
import { Context } from "telegraf";
import { supabaseServiceClient } from "@/db/config/server";

export const handleLinkCommand = () => {
  return async (ctx: Context) => {
    if (!ctx.chat) return;

    const chatId = ctx.chat.id.toString();

    try {
      // Check if user is already registered
      const { data: existingAuth, error: fetchError } =
        await supabaseServiceClient
          .from("telegram_auth")
          .select("*")
          .eq("chat_id", chatId)
          .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        console.error("Fetch error:", fetchError);
        throw fetchError;
      }

      // If user exists and is authenticated
      if (existingAuth?.authenticated && existingAuth?.wallet_address) {
        await ctx.reply(
          `
🔗 *Wallet Already Connected*

Your wallet \`${existingAuth.wallet_address}\` is already connected and verified.

To check your current status, use /status
To unlink this wallet, use /unlink
          `.trim(),
          {
            parse_mode: "Markdown",
          }
        );
        return;
      }

      // For both new users and pending verifications
      const verificationUrl = `localhost:3001/verify?chatId=${chatId}`;

      await ctx.reply(
        `
🔐 *Connect Your Wallet on TileVille*

1. Click the link below to verify your wallet
2. Complete the verification on TileVille
3. Return here once completed

[Click here to verify wallet](${verificationUrl})
or 

localhost:3001/verify?chatId=${chatId}
        `.trim(),
        {
          parse_mode: "Markdown",
          link_preview_options: { is_disabled: true },
        }
      );
    } catch (error) {
      console.error("Error in link command:", error);

      await ctx.reply(
        `
❌ *Error*

Sorry, there was an error processing your request. Please try again later.

Need help? Join our bug report channel: https://t.me/tilevilleBugs
        `.trim(),
        {
          parse_mode: "Markdown",
          link_preview_options: { is_disabled: true },
        }
      );
    }
  };
};
