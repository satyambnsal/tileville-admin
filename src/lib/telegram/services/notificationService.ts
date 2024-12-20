// src/lib/telegram/services/notificationService.ts
import { Telegraf } from "telegraf";
import { UserMapService } from "./userMapService";
import {
  AnnouncementData,
  CompetitionData,
  MaintenanceData,
  UpdateData,
} from "../types";

export class NotificationService {
  constructor(private bot: Telegraf, private userMapService: UserMapService) {}

  async notifyNewCompetition(userAddress: string, data: CompetitionData) {
    const chatId = await this.userMapService.getChatId(userAddress);
    if (!chatId) return;

    const msg = `
🎮 *New TileVille Competition!*

*${data.name}*

💰 *Entry Fee:* ${data.entryFee} MINA
🏆 *Prize Pool:* ${data.prizePool} MINA
🕒 *Starts:* ${data.startTime.toLocaleString()}
${data.endDate ? `📅 *Ends:* ${new Date(data.endDate).toLocaleString()}` : ""}

Join now: https://tileville.xyz/competitions/${encodeURIComponent(data.name)}
    `.trim();

    await this.bot.telegram.sendMessage(chatId, msg, {
      parse_mode: "Markdown",
      link_preview_options: { is_disabled: true },
    });
  }

  async notifyMaintenance(userAddress: string, data: MaintenanceData) {
    const chatId = await this.userMapService.getChatId(userAddress);
    if (!chatId) return;

    const msg = `
🔧 *Maintenance Alert!*

*${data.title}*

${data.message}
${data.startTime ? `\n🕒 *Starts:* ${data.startTime.toLocaleString()}` : ""}
${data.duration ? `\n⏱ *Duration:* ${data.duration}` : ""}
    `.trim();

    await this.bot.telegram.sendMessage(chatId, msg, {
      parse_mode: "Markdown",
    });
  }

  async notifyUpdate(userAddress: string, data: UpdateData) {
    const chatId = await this.userMapService.getChatId(userAddress);
    if (!chatId) return;

    const msg = `
🎮 *Game Update!*

*${data.title}*
${data.version ? `Version: ${data.version}\n` : ""}

${data.message}

Check it out at: https://tileville.xyz
    `.trim();

    await this.bot.telegram.sendMessage(chatId, msg, {
      parse_mode: "Markdown",
      link_preview_options: { is_disabled: true },
    });
  }

  async notifyAnnouncement(userAddress: string, data: AnnouncementData) {
    const chatId = await this.userMapService.getChatId(userAddress);
    if (!chatId) return;

    const priorityEmoji = {
      normal: "📢",
      high: "⚠️",
      urgent: "🚨",
    };

    const msg = `
  ${priorityEmoji[data.priority]} *${data.title}*
  
  ${data.message}
    `.trim();

    await this.bot.telegram.sendMessage(chatId, msg, {
      parse_mode: "Markdown",
    });
  }
}
