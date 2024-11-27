// src/lib/telegram/commands/linkCommand.ts
import { Context } from "telegraf";

export const handleLinkCommand = () => {
  return async (ctx: Context) => {
    if (!ctx.chat) return;

    const chatId = ctx.chat.id.toString();

    // Generate the verification URL with chatId
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
  };
};
