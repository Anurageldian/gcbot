const TelegramBot = require('node-telegram-bot-api');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const telegramBot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

let voiceChatId; // Variable to store the ongoing voice chat ID

// Handle /start command
telegramBot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  telegramBot.sendMessage(chatId, 'Hello! I am your group manager telegramBot.');
});

// Handle /kick command
telegramBot.onText(/\/kick (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const userId = match[1];

  bot.kickChatMember(chatId, userId)
    .then(() => bot.sendMessage(chatId, `User ${userId} has been kicked.`))
    .catch((error) => bot.sendMessage(chatId, `Error: ${error.message}`));
});

// Handle /ban command
telegramBot.onText(/\/ban (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const userId = match[1];

  bot.banChatMember(chatId, userId)
    .then(() => bot.sendMessage(chatId, `User ${userId} has been banned.`))
    .catch((error) => bot.sendMessage(chatId, `Error: ${error.message}`));
});

// Handle /promote command
telegramBot.onText(/\/promote (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const userId = match[1];

  telegramBot.promoteChatMember(chatId, userId, { can_change_info: true, can_invite_users: true })
    .then(() => bot.sendMessage(chatId, `User ${userId} has been promoted.`))
    .catch((error) => bot.sendMessage(chatId, `Error: ${error.message}`));
});

// Handle /report command
telegramBot.onText(/\/report (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const reportedUserId = match[1];

  telegramBot.sendMessage(chatId, `User ${reportedUserId} has been reported.`);
});

// Handle /banall command
telegramBot.onText(/\/banall/, (msg) => {
  const chatId = msg.chat.id;

  // Check if the sender is an admin or has the necessary permissions
  const senderId = msg.from.id;
  telegramBot.getChatMember(chatId, senderId)
    .then((chatMember) => {
      if (chatMember.status === 'administrator' || chatMember.status === 'creator') {
        // Get all administrators in the chat
        telegramBot.getChatAdministrators(chatId)
          .then((administrators) => {
            // Extract user IDs of administrators
            const adminIds = administrators.map(admin => admin.user.id);

            // Get all members in the chat
            telegramBot.getChatMembers(chatId)
              .then((members) => {
                members.forEach((member) => {
                  const memberId = member.user.id;
                  if (!adminIds.includes(memberId) && memberId !== senderId) {
                    telegramBot.kickChatMember(chatId, memberId);
                  }
                });
                telegramBot.sendMessage(chatId, 'All non-administrator members have been banned.');
              })
              .catch((error) => bot.sendMessage(chatId, `Error: ${error.message}`));
          })
          .catch((error) => bot.sendMessage(chatId, `Error: ${error.message}`));
      } else {
        telegramBot.sendMessage(chatId, 'You do not have the necessary permissions to use this command.');
      }
    })
    .catch((error) => bot.sendMessage(chatId, `Error: ${error.message}`));
});



// Handle /startvoicechat command
telegramBot.onText(/\/startvoicechat/, (msg) => {
  const chatId = msg.chat.id;

  // Start a voice chat
  bot.sendVoice(chatId, 'https://example.com/voice.ogg', { caption: 'Voice Chat Started' })
    .then((message) => {
      voiceChatId = message.voice.chat.id;
      bot.sendMessage(chatId, 'Voice chat started. Use /endvoicechat to end the chat.');
    })
    .catch((error) => bot.sendMessage(chatId, `Error: ${error.message}`));
});

// Handle /endvoicechat command
bot.onText(/\/endvoicechat/, (msg) => {
  const chatId = msg.chat.id;

  if (voiceChatId) {
    // Stop the voice chat
    bot.stopMessageLiveLocation(chatId, voiceChatId)
      .then(() => {
        bot.sendMessage(chatId, 'Voice chat ended.');
        voiceChatId = undefined;
      })
      .catch((error) => bot.sendMessage(chatId, `Error: ${error.message}`));
  } else {
    bot.sendMessage(chatId, 'No active voice chat found.');
  }
});


// Handle text messages
bot.onText(/.*/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, `You said: ${msg.text}`);
});
