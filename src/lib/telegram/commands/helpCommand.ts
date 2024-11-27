// src/lib/telegram/commands/helpCommand.ts
import { Context } from 'telegraf';
import { messages } from '../messages';

export const handleHelpCommand = async (ctx: Context) => {
  await ctx.reply(messages.help, { 
    parse_mode: 'Markdown',
    link_preview_options: { is_disabled: true }
  });
};
