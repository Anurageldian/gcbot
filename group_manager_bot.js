const TelegramBot = require('node-telegram-bot-api');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Create a new instance of the TelegramBot
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// Event listener for when a user sends a message
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  // Handle different commands
  switch (msg.text) {
    case '/start':
      bot.sendMessage(chatId, 'Hello! I am your moderation bot.');
      break;

    case '/ban':
      bot.kickChatMember(chatId, userId);
      bot.sendMessage(chatId, `User ${msg.from.first_name} has been banned.`);
      break;

    case '/report':
      bot.sendMessage(chatId, 'User reported.');
      break;

    case '/kick':
      bot.kickChatMember(chatId, userId);
      bot.sendMessage(chatId, `User ${msg.from.first_name} has been kicked.`);
      break;

    case '/promote':
      bot.promoteChatMember(chatId, userId, {
        can_change_info: true,
        can_invite_users: true,
      });
      bot.sendMessage(chatId, `User ${msg.from.first_name} has been promoted.`);
      break;

    default:
      // Respond to other messages
      bot.sendMessage(chatId, `You said: ${msg.text}`);
  }
});

// Log the bot's username to the console
bot.getMe().then((botInfo) => {
  console.log(`Bot has started! Username: @${botInfo.username}`);
});
