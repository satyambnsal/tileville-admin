// src/lib/telegram/commands/startCommand.ts
import { Context, Markup } from "telegraf";
import { messages } from "../messages";

export const handleStartCommand = async (ctx: Context) => {
  await ctx.reply(messages.welcome, {
    parse_mode: "Markdown",
    ...Markup.keyboard([["/link", "/status"], ["/help"]]).resize(),
  });
};
