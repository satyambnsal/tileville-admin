import { Telegraf, Markup } from "telegraf";

interface TelegramConfig {
  botToken: string;
  webhookUrl?: string;
}

export class TilevilleBot {
  private bot: Telegraf;
  private userMap: Map<string, string> = new Map(); // Maps user address to telegram chat ID
  private pendingLinks: Map<string, string> = new Map(); // Maps code to wallet address

  constructor(config: TelegramConfig) {
    this.bot = new Telegraf(config.botToken);
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
        {
          command: "link",
          description: "Link your TileVille wallet address",
        },
        {
          command: "status",
          description: "Check your current notification settings",
        },
        {
          command: "help",
          description: "Show all available commands",
        },
        {
          command: "unlink",
          description: "Unlink your TileVille account",
        },
      ]);
      console.log("Bot commands setup successfully");
    } catch (error) {
      console.error("Error setting up bot commands:", error);
    }
  }

  private setupCommandHandlers() {
    // Start command
    this.bot.command("start", async (ctx) => {
      const welcomeMessage = `
🎮 Welcome to TileVille Bot! 🏰

I'll keep you updated about:
• New competitions
• Competition results
• Game updates
• Important announcements

Available Commands:
/link - Connect your TileVille wallet
/status - Check your notification settings
/help - Show all commands
/unlink - Disconnect your wallet

Get started by linking your wallet with the /link command!

Need help? Join our bug report channel: https://t.me/tilevilleBugs
      `.trim();

      await ctx.reply(welcomeMessage, {
        parse_mode: "Markdown",
        ...Markup.keyboard([
          ["/link", "/status"],
          ["/help", "/unlink"],
        ]).resize(),
      });
    });

    // Help command
    this.bot.command("help", async (ctx) => {
      const helpMessage = `
📚 *TileVille Bot Commands*

/start - Initialize the bot
/link - Connect your wallet to receive notifications
/status - View your current settings
/unlink - Disconnect your wallet
/help - Show this help message

*How to use:*
1. Use /link followed by your wallet address
   Example: /link B62qjsV2...

2. Check your status with /status

3. You'll automatically receive:
   • Competition announcements
   • Results and rewards
   • Important game updates

Need help? Join our bug report channel: https://t.me/tilevilleBugs
      `.trim();

      await ctx.reply(helpMessage, {
        parse_mode: "Markdown",
        link_preview_options: { is_disabled: true },
      });
    });

    // Link command
    this.bot.command("link", async (ctx) => {
      const args = ctx.message.text.split(" ");

      if (args.length !== 2) {
        const linkHelp = `
⚠️ *Wallet Address Required*

Please provide your TileVille wallet address:
\`/link YOUR_WALLET_ADDRESS\`

Example:
\`/link B62qjsV2...\`

Your wallet address can be found in your TileVille profile settings.

Having trouble? Join our bug report channel: https://t.me/tilevilleBugs
        `.trim();

        await ctx.reply(linkHelp, {
          parse_mode: "Markdown",
        });
        return;
      }

      const walletAddress = args[1];
      const chatId = ctx.chat.id.toString();

      // Basic validation for Mina wallet address
      if (!walletAddress.startsWith("B62q")) {
        await ctx.reply(
          "❌ Invalid wallet address format. Mina addresses start with B62q"
        );
        return;
      }

      // Check for existing links
      for (const [address, id] of this.userMap.entries()) {
        if (id === chatId) {
          await ctx.reply(
            `
⚠️ Already Linked

This Telegram account is already linked to wallet:
\`${address}\`

Use /unlink first if you want to link a different wallet.

Need help? Join our bug report channel: https://t.me/tilevilleBugs
          `.trim(),
            {
              parse_mode: "Markdown",
            }
          );
          return;
        }
      }

      // Link the wallet
      await this.linkUser(walletAddress, chatId);

      await ctx.reply(
        `
✅ *Successfully Connected!*

Your wallet has been linked:
\`${walletAddress}\`

You will receive notifications for:
• New competitions
• Competition results
• Important updates
• System announcements

Use /status to check your settings anytime.
      `.trim(),
        {
          parse_mode: "Markdown",
        }
      );
    });

    // Status command
    this.bot.command("status", async (ctx) => {
      const chatId = ctx.chat.id.toString();
      let linkedWallet: string | undefined;

      for (const [address, id] of this.userMap.entries()) {
        if (id === chatId) {
          linkedWallet = address;
          break;
        }
      }

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
    });

    // Unlink command
    this.bot.command("unlink", async (ctx) => {
      const chatId = ctx.chat.id.toString();
      let userAddress: string | undefined;

      for (const [address, id] of this.userMap.entries()) {
        if (id === chatId) {
          userAddress = address;
          break;
        }
      }

      if (userAddress) {
        this.userMap.delete(userAddress);
        await ctx.reply(
          `
✅ *Successfully Unlinked*

Your wallet has been disconnected from TileVille notifications.

Use /link to connect a new wallet anytime.
        `.trim(),
          {
            parse_mode: "Markdown",
          }
        );
      } else {
        await ctx.reply(
          `
ℹ️ *No Wallet Found*

You don't have any wallet connected to unlink.

Use /link to connect a wallet and start receiving notifications.
        `.trim(),
          {
            parse_mode: "Markdown",
          }
        );
      }
    });

    // Handle unknown commands
    this.bot.on("text", async (ctx) => {
      if (ctx.message.text.startsWith("/")) {
        await ctx.reply(
          `
❓ *Unknown Command*

I don't recognize that command.
Use /help to see all available commands.
        `.trim(),
          {
            parse_mode: "Markdown",
          }
        );
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

  // Link a user's wallet address to their Telegram chat ID
  async linkUser(userAddress: string, chatId: string) {
    try {
      this.userMap.set(userAddress, chatId);
      console.log(`Linked wallet ${userAddress} to chat ${chatId}`);
    } catch (error) {
      console.error("Error linking user:", error);
      throw error;
    }
  }

  // Send notification about new competition
  async notifyNewCompetition(
    userAddress: string,
    competitionData: {
      name: string;
      entryFee: number;
      startTime: Date;
      prizePool: number;
      endDate?: string | Date;
    }
  ) {
    try {
      console.log("Notifying about competition:", {
        userAddress,
        competitionData,
      });
      const chatId = this.userMap.get(userAddress);

      if (!chatId) {
        console.log(`No chat ID found for address: ${userAddress}`);
        return;
      }

      const msg = `
🎮 *New TileVille Competition!*

*${competitionData.name}*

💰 *Entry Fee:* ${competitionData.entryFee} MINA
🏆 *Prize Pool:* ${competitionData.prizePool} MINA
🕒 *Starts:* ${competitionData.startTime.toLocaleString()}
${
  competitionData.endDate
    ? `📅 *Ends:* ${new Date(competitionData.endDate).toLocaleString()}`
    : ""
}

Join now: https://tileville.xyz/competitions/${encodeURIComponent(
        competitionData.name
      )}
      `.trim();

      await this.bot.telegram.sendMessage(chatId, msg, {
        parse_mode: "Markdown",
        link_preview_options: { is_disabled: true },
      });
      console.log(`Competition notification sent to ${chatId}`);
    } catch (error) {
      console.error("Error sending competition notification:", error);
      throw error;
    }
  }

  // Send notification about maintenance
  async notifyMaintenance(
    userAddress: string,
    maintenanceData: {
      title: string;
      message: string;
      startTime?: Date;
      duration?: string;
    }
  ) {
    try {
      const chatId = this.userMap.get(userAddress);
      if (!chatId) return;

      const msg = `
🔧 *Maintenance Alert!*

*${maintenanceData.title}*

${maintenanceData.message}
${
  maintenanceData.startTime
    ? `\n🕒 *Starts:* ${maintenanceData.startTime.toLocaleString()}`
    : ""
}
${maintenanceData.duration ? `\n⏱ *Duration:* ${maintenanceData.duration}` : ""}
      `.trim();

      await this.bot.telegram.sendMessage(chatId, msg, {
        parse_mode: "Markdown",
      });
    } catch (error) {
      console.error("Error sending maintenance notification:", error);
      throw error;
    }
  }

  // Send notification about game updates
  async notifyUpdate(
    userAddress: string,
    updateData: {
      title: string;
      message: string;
      version?: string;
    }
  ) {
    try {
      const chatId = this.userMap.get(userAddress);
      if (!chatId) return;

      const msg = `
🎮 *Game Update!*

*${updateData.title}*
${updateData.version ? `Version: ${updateData.version}\n` : ""}

${updateData.message}

Check it out at: https://tileville.xyz
      `.trim();

      await this.bot.telegram.sendMessage(chatId, msg, {
        parse_mode: "Markdown",
        link_preview_options: { is_disabled: true },
      });
    } catch (error) {
      console.error("Error sending update notification:", error);
      throw error;
    }
  }

  // Send general announcement
  async notifyAnnouncement(
    userAddress: string,
    announcementData: {
      title: string;
      message: string;
      priority: string;
    }
  ) {
    try {
      const chatId = this.userMap.get(userAddress);
      if (!chatId) return;

      const priorityEmoji = {
        normal: "📢",
        high: "⚠️",
        urgent: "🚨",
      };

      const msg = `
${priorityEmoji[announcementData.priority as keyof typeof priorityEmoji]} *${
        announcementData.title
      }*

${announcementData.message}
      `.trim();

      await this.bot.telegram.sendMessage(chatId, msg, {
        parse_mode: "Markdown",
      });
    } catch (error) {
      console.error("Error sending announcement:", error);
      throw error;
    }
  }

  // Check if a user is registered for notifications
  isUserRegistered(userAddress: string): boolean {
    return this.userMap.has(userAddress);
  }
}

// Bot instance management
let bot: TilevilleBot | null = null;

export function getBot() {
  if (!bot) {
    const config: TelegramConfig = {
      botToken: process.env.TILEVILLE_MAYOR_BOT_TOKEN!,
      webhookUrl: process.env.TILEVILLE_MAYOR_BOT_WEBHOOK_URL,
    };
    bot = new TilevilleBot(config);
  }
  return bot;
}
