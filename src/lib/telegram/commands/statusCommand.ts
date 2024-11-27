// src/lib/telegram/commands/statusCommand.ts
import { Context } from "telegraf";
import { UserMapService } from "../services/userMapService";

export const handleStatusCommand = (userMapService: UserMapService) => {
  return async (ctx: Context) => {
    try {
      if (!ctx.chat) {
        console.error("Chat context not found");
        return;
      }

      const chatId = ctx.chat.id.toString();

      // Check if user exists in UserMapService first
      if (!userMapService.isChatIdLinked(chatId)) {
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
        return;
      }

      // Only try to get the wallet if we know the user is linked
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
      }
    } catch (error) {
      console.error("Error in status command:", error);
      await ctx.reply(
        `
⚠️ *Error Checking Status*

Sorry, there was an error checking your status. Please try again later.

If the problem persists:
• Check if the bot is working with /start
• Report the issue in our support channel
• Try again in a few minutes

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
