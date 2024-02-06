const TelegramBot = require('node-telegram-bot-api');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Create a new instance of the TelegramBot
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// Event listener for when a user sends a message
bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  // Handle different commands
  switch (msg.text.split(' ')[0]) {
    case '/start':
      bot.sendMessage(chatId, 'Hello! I am your moderation bot.');
      break;

    case '/ban':
      handleBanCommand(msg);
      break;

    case '/report':
      bot.sendMessage(chatId, 'User reported.');
      break;

    case '/kick':
      handleKickCommand(msg);
      break;

    case '/promote':
      handlePromoteCommand(msg);
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

// Function to handle the /ban command
function handleBanCommand(msg) {
  const chatId = msg.chat.id;
  const username = msg.text.split(' ')[1];

  if (!username) {
    bot.sendMessage(chatId, 'Please provide a username to ban.');
    return;
  }

  // Get user information by username
  bot.getChatMember(chatId, `@${username}`)
    .then((chatMember) => {
      const userId = chatMember.user.id;
      bot.kickChatMember(chatId, userId);
      bot.sendMessage(chatId, `User @${username} has been banned.`);
    })
    .catch((error) => {
      bot.sendMessage(chatId, `Error: ${error.message}`);
    });
}

// Function to handle the /kick command
function handleKickCommand(msg) {
  const chatId = msg.chat.id;
  const username = msg.text.split(' ')[1];

  if (!username) {
    bot.sendMessage(chatId, 'Please provide a username to kick.');
    return;
  }

  // Get user information by username
  bot.getChatMember(chatId, `@${username}`)
    .then((chatMember) => {
      const userId = chatMember.user.id;
      bot.kickChatMember(chatId, userId);
      bot.sendMessage(chatId, `User @${username} has been kicked.`);
    })
    .catch((error) => {
      bot.sendMessage(chatId, `Error: ${error.message}`);
    });
}

// Function to handle the /promote command
function handlePromoteCommand(msg) {
  const chatId = msg.chat.id;
  const username = msg.text.split(' ')[1];

  if (!username) {
    bot.sendMessage(chatId, 'Please provide a username to promote.');
    return;
  }

  // Get user information by username
  bot.getChatMember(chatId, `@${username}`)
    .then((chatMember) => {
      const userId = chatMember.user.id;
      bot.promoteChatMember(chatId, userId, {
        can_change_info: true,
        can_invite_users: true,
      });
      bot.sendMessage(chatId, `User @${username} has been promoted.`);
    })
    .catch((error) => {
      bot.sendMessage(chatId, `Error: ${error.message}`);
    });
}
