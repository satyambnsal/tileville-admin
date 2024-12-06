// src/lib/telegram/messages.ts

const getRandomWelcomeMessage = (firstName: string) => {
  const messages = [
    `
🎮 A new builder has arrived! Welcome to TileVille, ${firstName}! 🏰

Ready to create, compete, and conquer? 
Connect with @tileville\\_mayor\\_bot in private chat to:
🎯 Get instant competition alerts
🏆 Never miss a prize pool
🔔 Stay updated with game news

Let's build something amazing together! 🌟
    `,
    `
🌟 Welcome to the world of TileVille, ${firstName}! 🎮

Your journey as a master builder begins now! To maximize your experience:
1️⃣ Start a chat with @tileville\\_mayor\\_bot
2️⃣ Get notified about new competitions
3️⃣ Join the building revolution!

See you on the building grounds! 🏗️
    `,
    `
🎉 Hey ${firstName}, welcome to the TileVille community! 🏰

Want to stay ahead in the game?
📱 Message @tileville\\_mayor\\_bot privately to:
• Get instant competition alerts 🎯
• Receive special announcements 📢
• Track your achievements 🏆

Your building adventure awaits! 🌟
    `,
    `
🏰 Welcome to TileVille's official community, ${firstName}! 

To become a legendary builder:
🤖 Connect with @tileville\\_mayor\\_bot
🎯 Get real-time competition updates
🏆 Never miss a winning opportunity

Ready to shape the future of TileVille? Let's build! 🚀
    `,
  ];

  return messages[Math.floor(Math.random() * messages.length)].trim();
};

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

Get started by linking your wallet with the /link command!

Need help? Join our bug report channel: https://t.me/tilevilleBugs
  `.trim(),

  help: `
📚 *TileVille Bot Commands*

/start - Start the bot and see welcome message
/link - Connect your wallet to receive notifications
/status - Check your wallet connection status
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

  groupWelcome: getRandomWelcomeMessage,
};
