// src/lib/telegram/bot.ts
import { Telegraf, Context } from "telegraf";
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
import { Update } from "telegraf/types";

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
      // First, delete commands for all scopes
      await this.bot.telegram.deleteMyCommands();

      // Explicitly delete commands for groups
      await this.bot.telegram.deleteMyCommands({
        scope: { type: "all_group_chats" },
      });

      // Set commands only for private chats
      await this.bot.telegram.setMyCommands(
        [
          {
            command: "start",
            description: "Start the bot and get welcome message",
          },
          {
            command: "link",
            description: "Link your TileVille wallet address",
          },
          {
            command: "status",
            description: "Check your current notification settings",
          },
          { command: "help", description: "Show all available commands" },
        ],
        {
          scope: { type: "all_private_chats" },
          language_code: "en",
        }
      );

      console.log("Bot commands setup successfully");
    } catch (error) {
      console.error("Error setting up bot commands:", error);
    }
  }

  private setupCommandHandlers() {
    const privateChat = async (
      ctx: Context<Update>,
      next: () => Promise<void>
    ) => {
      if (ctx.chat?.type === "private") {
        return next();
      }
      // For groups, check if it's a text message with a command
      if (
        ctx.message &&
        "text" in ctx.message &&
        ctx.message.text?.startsWith("/")
      ) {
        return; // Silently ignore commands in groups
      }
      return next(); // Allow non-command messages to pass through
    };

    // Use middleware for all updates
    this.bot.use(privateChat);

    this.bot.command("start", handleStartCommand);
    this.bot.command("help", handleHelpCommand);
    this.bot.command("link", handleLinkCommand());
    this.bot.command("status", handleStatusCommand());

    // Handle unknown commands only in private chats
    this.bot.on("text", async (ctx) => {
      if (
        ctx.chat?.type === "private" &&
        ctx.message &&
        "text" in ctx.message &&
        ctx.message.text.startsWith("/")
      ) {
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

  async sendGroupMessage(
    groupId: string,
    message: string,
    groupTopicId?: number
  ) {
    try {
      await this.bot.telegram.sendMessage(groupId, message, {
        parse_mode: "Markdown",
        message_thread_id: groupTopicId,
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
