// src/lib/telegram/commands/statusCommand.ts
import { Context } from "telegraf";
import { UserMapService } from "../services/userMapService";

export const handleStatusCommand = (userMapService: UserMapService) => {
  return async (ctx: Context) => {
    if (!ctx.chat) return;

    const chatId = ctx.chat.id.toString();
    const linkedWallet = userMapService.getAddressByChatId(chatId);

    if (linkedWallet) {
      await ctx.reply(
        `
📱 *Current Status*

*Linked Wallet:*
\`${linkedWallet}\`

*Notifications Enabled:*
✅ Competition announcements
✅ Competition results
✅ Game updates
✅ System maintenance
✅ Important announcements

Use /unlink to disconnect this wallet.
      `.trim(),
        {
          parse_mode: "Markdown",
        }
      );
    } else {
      await ctx.reply(
        `
❌ *No Wallet Connected*

You haven't linked a TileVille wallet yet.
Use /link <wallet_address> to connect your wallet and start receiving notifications.

Need help? Use /help for more information.
      `.trim(),
        {
          parse_mode: "Markdown",
        }
      );
    }
  };
};
