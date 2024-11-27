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
    `.trim(),

  linkHelp: `
  ⚠️ *Wallet Address Required*
  
  Please provide your TileVille wallet address:
  \`/link YOUR_WALLET_ADDRESS\`
  
  Example:
  \`/link B62qjsV2...\`
  
  Your wallet address can be found in your TileVille profile settings.
  
  Having trouble? Join our bug report channel: https://t.me/tilevilleBugs
    `.trim(),

  unknownCommand: `
  ❓ *Unknown Command*
  
  I don't recognize that command.
  Use /help to see all available commands.
    `.trim(),
};
