// src/lib/telegram/commands/linkCommand.ts
import { Context } from "telegraf";
import { messages } from "../messages";
import { UserMapService } from "../services/userMapService";

const validateWalletAddress = (address: string): boolean => {
  return address.startsWith("B62q");
};

export const handleLinkCommand = (userMapService: UserMapService) => {
  return async (ctx: Context) => {
    if (!ctx.message || !("text" in ctx.message) || !ctx.chat) return;

    const args = ctx.message.text.split(" ");
    const chatId = ctx.chat.id.toString();

    if (args.length !== 2) {
      await ctx.reply(messages.linkHelp, { parse_mode: "Markdown" });
      return;
    }

    const walletAddress = args[1];

    if (!validateWalletAddress(walletAddress)) {
      await ctx.reply(
        `
❌ *Invalid Wallet Address*

The provided address is not a valid Mina wallet address.
A valid Mina address starts with 'B62q'.

Example: B62qk1KqJq2m59NJuPmHHWDFsejzc21Hr8gcHqWYfhM51dwpsVxtEQS

Try again with a valid address or use /help for more information.
      `.trim(),
        {
          parse_mode: "Markdown",
        }
      );
      return;
    }

    if (userMapService.isChatIdLinked(chatId)) {
      const currentAddress = userMapService.getAddressByChatId(chatId);
      await ctx.reply(
        `
⚠️ *Already Linked*

This Telegram account is already linked to wallet:
\`${currentAddress}\`

To link a different wallet:
1. First use /unlink to disconnect current wallet
2. Then use /link with your new wallet address

Need help? Use /help for more information.
      `.trim(),
        {
          parse_mode: "Markdown",
        }
      );
      return;
    }

    try {
      await userMapService.linkUser(walletAddress, chatId);

      await ctx.reply(
        `
✅ *Successfully Connected!*

Your wallet has been linked:
\`${walletAddress}\`

You will now receive:
• New competition announcements
• Competition results
• Important updates
• System announcements

Use /status to check your settings anytime.
      `.trim(),
        {
          parse_mode: "Markdown",
        }
      );
    } catch (error) {
      console.error("Error linking wallet:", error);
      await ctx.reply(
        `
❌ *Error Linking Wallet*

Sorry, there was an error linking your wallet. Please try again later.

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
