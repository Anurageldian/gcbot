const TelegramBot = require('node-telegram-bot-api');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });



// Handle /start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Hello! I am your group manager bot.');
});

// Handle /kick command
bot.onText(/\/kick (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const userId = match[1];

  bot.kickChatMember(chatId, userId)
    .then(() => bot.sendMessage(chatId, `User ${userId} has been kicked.`))
    .catch((error) => bot.sendMessage(chatId, `Error: ${error.message}`));
});

// Handle /ban command
bot.onText(/\/ban (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const userId = match[1];

  bot.banChatMember(chatId, userId)
    .then(() => bot.sendMessage(chatId, `User ${userId} has been banned.`))
    .catch((error) => bot.sendMessage(chatId, `Error: ${error.message}`));
});

// Handle /promote command
bot.onText(/\/promote (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const userId = match[1];

  bot.promoteChatMember(chatId, userId, { can_change_info: true, can_invite_users: true })
    .then(() => bot.sendMessage(chatId, `User ${userId} has been promoted.`))
    .catch((error) => bot.sendMessage(chatId, `Error: ${error.message}`));
});

// Handle /report command
bot.onText(/\/report (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const reportedUserId = match[1];

  bot.sendMessage(chatId, `User ${reportedUserId} has been reported.`);
});

// Handle text messages
bot.onText(/.*/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, `You said: ${msg.text}`);
});
