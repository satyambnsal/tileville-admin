// src/lib/telegram/commands/unlinkCommand.ts
import { Context } from "telegraf";
import { UserMapService } from "../services/userMapService";

export const handleUnlinkCommand = (userMapService: UserMapService) => {
  return async (ctx: Context) => {
    if (!ctx.chat) return;

    const chatId = ctx.chat.id.toString();
    const currentAddress = userMapService.getAddressByChatId(chatId);

    if (currentAddress) {
      userMapService.unlinkByChatId(chatId);
      await ctx.reply(
        `
✅ *Successfully Unlinked*

Your wallet has been disconnected from TileVille notifications.

Use /link to connect a new wallet anytime.
      `.trim(),
        {
          parse_mode: "Markdown",
        }
      );
    } else {
      await ctx.reply(
        `
ℹ️ *No Wallet Found*

You don't have any wallet connected to unlink.

Use /link to connect a wallet and start receiving notifications.
      `.trim(),
        {
          parse_mode: "Markdown",
        }
      );
    }
  };
};
