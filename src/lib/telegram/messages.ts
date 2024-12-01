// src/lib/telegram/messages.ts
export const messages = {
  welcome: `
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
  `.trim(),

  help: `
📚 *TileVille Bot Commands*

/start - Start the bot and see welcome message
/link - Connect your wallet to receive notifications
/status - Check your wallet connection status
/unlink - Disconnect your wallet from notifications
/help - Show this help message

*Wallet Connection Process:*
1. Use /link to start the connection process
2. Click the verification link provided
3. Connect your wallet on TileVille website
4. Sign the verification message
5. Once verified, you'll receive confirmation here

*What You'll Receive:*
• New competition announcements
• Competition results
• Game updates and maintenance alerts
• Important announcements

*Managing Your Connection:*
• Use /status to check your current connection
• Use /unlink to disconnect your wallet
• Reconnect anytime using /link

Need help? Join our bug report channel: https://t.me/tilevilleBugs
  `.trim(),

  linkHelp: `
⚠️ *Connect Your TileVille Wallet*

Please follow these steps:
1. Click the verification link provided
2. Connect your wallet on TileVille
3. Sign the verification message
4. Wait for confirmation

Having trouble? Join our bug report channel: https://t.me/tilevilleBugs
  `.trim(),

  unknownCommand: `
❓ *Unknown Command*

I don't recognize that command.
Use /help to see all available commands.
  `.trim(),
};
