import { Telegraf } from 'telegraf'

interface TelegramConfig {
  botToken: string
  webhookUrl?: string
}

export class TilevilleBot {
  private bot: Telegraf
  private userMap: Map<string, string> = new Map() // Maps user address to telegram chat ID
  private pendingLinks: Map<string, string> = new Map() // Maps code to wallet address

  constructor(config: TelegramConfig) {
    this.bot = new Telegraf(config.botToken)
    this.setupCommands()

    if (config.webhookUrl) {
      this.bot.telegram.setWebhook(config.webhookUrl)
    }
  }

  private setupCommands() {
    // Start command to initiate bot interaction
    this.bot.command('start', async (ctx) => {
      const msg =
        `Welcome to TileVille Bot! 🏰\n\n` +
        `Available commands:\n` +
        `/link <wallet_address> - Link your wallet address\n` +
        `/help - Show all commands\n` +
        `/status - Check your notification settings\n` +
        `/unlink - Unlink your TileVille account`

      await ctx.reply(msg)
    })

    // Help command
    this.bot.command('help', async (ctx) => {
      const helpText =
        `TileVille Bot Commands:\n\n` +
        `/start - Start bot interaction\n` +
        `/link <wallet_address> - Link your wallet address\n` +
        `/help - Show this help message\n` +
        `/status - Check your notification settings\n` +
        `/unlink - Unlink your TileVille account`

      await ctx.reply(helpText)
    })

    // Link wallet command
    this.bot.command('link', async (ctx) => {
      const args = ctx.message.text.split(' ')
      if (args.length !== 2) {
        await ctx.reply('Please provide your wallet address. Usage: /link <wallet_address>')
        return
      }

      const walletAddress = args[1]
      const chatId = ctx.chat.id.toString()

      // Basic validation for Mina wallet address format
      if (!walletAddress.startsWith('B62q')) {
        await ctx.reply('Invalid wallet address format. Mina addresses start with B62q')
        return
      }

      // Check if this chat is already linked to a wallet
      let existingWallet: string | undefined
      for (const [address, id] of this.userMap.entries()) {
        if (id === chatId) {
          existingWallet = address
          break
        }
      }

      if (existingWallet) {
        await ctx.reply(
          `This Telegram account is already linked to wallet: ${existingWallet}\n` +
            `Use /unlink first if you want to link a different wallet.`
        )
        return
      }

      // Link the wallet
      await this.linkUser(walletAddress, chatId)

      await ctx.reply(
        `✅ Successfully linked wallet: ${walletAddress}\n\n` +
          `You will receive notifications for:\n` +
          `• New competitions\n` +
          `• New followers\n` +
          `• Competition results\n\n` +
          `Use /status to check your current settings`
      )
    })

    // Status command to check current links
    this.bot.command('status', async (ctx) => {
      const chatId = ctx.chat.id.toString()
      let linkedWallet: string | undefined

      // Find wallet address by chat ID
      for (const [address, id] of this.userMap.entries()) {
        if (id === chatId) {
          linkedWallet = address
          break
        }
      }

      if (linkedWallet) {
        await ctx.reply(
          `Current Status:\n\n` +
            `Linked Wallet: ${linkedWallet}\n` +
            `Notifications: Enabled\n\n` +
            `Use /unlink to remove this connection`
        )
      } else {
        await ctx.reply(
          `No wallet currently linked.\n` + `Use /link <wallet_address> to connect your wallet`
        )
      }
    })

    // Unlink command to remove notifications
    this.bot.command('unlink', async (ctx) => {
      const chatId = ctx.chat.id.toString()
      let userAddress: string | undefined

      // Find user address by chat ID
      for (const [address, id] of this.userMap.entries()) {
        if (id === chatId) {
          userAddress = address
          break
        }
      }

      if (userAddress) {
        this.userMap.delete(userAddress)
        await ctx.reply(
          '✅ Successfully unlinked your wallet from Telegram notifications.\n' +
            'Use /link <wallet_address> to link a new wallet.'
        )
      } else {
        await ctx.reply('No linked TileVille account found.')
      }
    })
  }

  async start() {
    await this.bot.launch()
    console.log('TileVille bot started')
  }

  // Link a user's wallet address to their Telegram chat ID
  async linkUser(userAddress: string, chatId: string) {
    this.userMap.set(userAddress, chatId)

    const msg =
      `Successfully linked your TileVille account!\n\n` +
      `You will now receive notifications for:\n` +
      `• New competitions\n` +
      `• New followers\n` +
      `• Competition results`

    await this.bot.telegram.sendMessage(chatId, msg)
  }

  // Send notification about new competition
  async notifyNewCompetition(
    userAddress: string,
    competitionData: {
      name: string
      entryFee: number
      startTime: Date
      prizePool: number
    }
  ) {
    console.log('User Address', userAddress)
    console.log('User map', this.userMap.entries())
    const chatId = this.userMap.get(userAddress)

    if (!chatId) return
    console.log('Chat ID', chatId)

    const msg =
      `🎮 New TileVille Competition!\n\n` +
      `Name: ${competitionData.name}\n` +
      `Entry Fee: ${competitionData.entryFee} MINA\n` +
      `Prize Pool: ${competitionData.prizePool} MINA\n` +
      `Starts: ${competitionData.startTime.toLocaleString()}\n\n` +
      `Join now: https://tileville.xyz/competitions/${competitionData.name}`

    await this.bot.telegram.sendMessage(chatId, msg)
  }

  // Send notification about new follower
  async notifyNewFollower(
    userAddress: string,
    followerData: {
      username: string
      profileUrl: string
    }
  ) {
    const chatId = this.userMap.get(userAddress)
    if (!chatId) return

    const msg =
      `👤 New Follower!\n\n` +
      `${followerData.username} started following you on TileVille!\n` +
      `View profile: ${followerData.profileUrl}`

    await this.bot.telegram.sendMessage(chatId, msg)
  }

  // Send competition results
  async notifyCompetitionResults(
    userAddress: string,
    results: {
      competitionName: string
      rank: number
      score: number
      reward?: number
    }
  ) {
    const chatId = this.userMap.get(userAddress)
    if (!chatId) return

    let msg =
      `🏆 Competition Results: ${results.competitionName}\n\n` +
      `Your Rank: ${results.rank}\n` +
      `Final Score: ${results.score}`

    if (results.reward) {
      msg += `\nReward: ${results.reward} MINA`
    }

    msg += `\n\nView details: https://tileville.xyz/competitions/${results.competitionName}/results`

    await this.bot.telegram.sendMessage(chatId, msg)
  }

  // Method to check if a user is registered for notifications
  isUserRegistered(userAddress: string): boolean {
    return this.userMap.has(userAddress)
  }

  // Stop the bot
  async stop() {
    await this.bot.stop()
  }
}

// Example usage
const config: TelegramConfig = {
  botToken: process.env.TILEVILLE_MAYOR_BOT_TOKEN!,
  webhookUrl: process.env.TILEVILLE_MAYOR_BOT_WEBHOOK_URL, // Optional
}

let bot: TilevilleBot | null = null

export function getBot() {
  if (!bot) {
    bot = new TilevilleBot(config)
  }
  return bot
}
