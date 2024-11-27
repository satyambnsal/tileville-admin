import { TilevilleBot } from "./bot";

let bot: TilevilleBot | null = null;

export function getBot() {
  if (!bot) {
    const config = {
      botToken: process.env.TILEVILLE_MAYOR_BOT_TOKEN!,
      webhookUrl: process.env.TILEVILLE_MAYOR_BOT_WEBHOOK_URL,
    };
    bot = new TilevilleBot(config);
  }
  return bot;
}

export * from "./types";
