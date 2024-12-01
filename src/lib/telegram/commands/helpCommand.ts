// src/lib/telegram/commands/helpCommand.ts
import { Context } from "telegraf";
import { messages } from "../messages";

export const handleHelpCommand = async (ctx: Context) => {
  try {
    await ctx.reply(messages.help, {
      parse_mode: "Markdown",
      link_preview_options: { is_disabled: true },
    });
  } catch (error) {
    console.error("Error sending help message:", error);
    await ctx.reply(
      `❌ *Error*\n\nSorry, there was an error showing the help message. Please try again later.\n\nNeed help? Join our bug report channel: https://t.me/tilevilleBugs`,
      {
        parse_mode: "Markdown",
        link_preview_options: { is_disabled: true },
      }
    );
  }
};
