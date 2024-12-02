// src/lib/telegram/bot.ts
import { Telegraf } from "telegraf";
import { TelegramConfig } from "./types";
import { UserMapService } from "./services/userMapService";
import { NotificationService } from "./services/notificationService";
import { messages } from "./messages";
import {
  handleStartCommand,
  handleHelpCommand,
  handleLinkCommand,
  handleStatusCommand,
} from "./commands";
import {
  CompetitionData,
  MaintenanceData,
  UpdateData,
  AnnouncementData,
} from "./types";

export class TilevilleBot {
  private bot: Telegraf;
  private userMapService: UserMapService;
  private notificationService: NotificationService;

  constructor(config: TelegramConfig) {
    this.bot = new Telegraf(config.botToken);
    this.userMapService = new UserMapService();
    this.notificationService = new NotificationService(
      this.bot,
      this.userMapService
    );

    this.setupCommands();
    this.setupCommandHandlers();

    if (config.webhookUrl) {
      this.bot.telegram.setWebhook(config.webhookUrl);
    }
  }

  private async setupCommands() {
    try {
      await this.bot.telegram.setMyCommands([
        {
          command: "start",
          description: "Start the bot and get welcome message",
        },
        { command: "link", description: "Link your TileVille wallet address" },
        {
          command: "status",
          description: "Check your current notification settings",
        },
        { command: "help", description: "Show all available commands" },
      ]);
      console.log("Bot commands setup successfully");
    } catch (error) {
      console.error("Error setting up bot commands:", error);
    }
  }

  private setupCommandHandlers() {
    this.bot.command("start", handleStartCommand);
    this.bot.command("help", handleHelpCommand);
    this.bot.command("link", handleLinkCommand());
    this.bot.command("status", handleStatusCommand());

    // Handle unknown commands
    this.bot.on("text", async (ctx) => {
      if (ctx.message.text.startsWith("/")) {
        await ctx.reply(messages.unknownCommand, { parse_mode: "Markdown" });
      }
    });
  }

  async start() {
    try {
      await this.bot.launch();
      console.log("TileVille bot started successfully");
      return { success: true };
    } catch (error) {
      console.error("Error starting bot:", error);
      throw error;
    }
  }

  async stop() {
    try {
      await this.bot.stop();
      console.log("TileVille bot stopped");
    } catch (error) {
      console.error("Error stopping bot:", error);
      throw error;
    }
  }

  async sendDirectMessage(chatId: string, message: string) {
    try {
      await this.bot.telegram.sendMessage(chatId, message, {
        parse_mode: "Markdown",
      });
      return true;
    } catch (error) {
      console.error("Error sending direct message:", error);
      throw error;
    }
  }

  async sendGroupMessage(groupId: string, message: string, topicId?: number) {
    try {
      await this.bot.telegram.sendMessage(groupId, message, {
        parse_mode: "Markdown",
        message_thread_id: topicId, // This is used for topics in supergroups
      });
      return true;
    } catch (error) {
      console.error("Error sending group message:", error);
      throw error;
    }
  }

  // Notification methods
  async notifyNewCompetition(userAddress: string, data: CompetitionData) {
    return this.notificationService.notifyNewCompetition(userAddress, data);
  }

  async notifyMaintenance(userAddress: string, data: MaintenanceData) {
    return this.notificationService.notifyMaintenance(userAddress, data);
  }

  async notifyUpdate(userAddress: string, data: UpdateData) {
    return this.notificationService.notifyUpdate(userAddress, data);
  }

  async notifyAnnouncement(userAddress: string, data: AnnouncementData) {
    return this.notificationService.notifyAnnouncement(userAddress, data);
  }

  isUserRegistered(userAddress: string): boolean {
    return this.userMapService.isUserRegistered(userAddress);
  }
}
