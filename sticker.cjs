const TelegramBot = require('node-telegram-bot-api');
const fetch = require('node-fetch');
const fs = require('fs');
require('dotenv').config();

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

// Function to fetch stickers from combot.org
async function searchStickerPacks(query) {
    const combotStickersUrl = 'https://combot.org/telegram/stickers?q=';

    try {
        const response = await fetch(combotStickersUrl + encodeURIComponent(query));
        const text = await response.text();
        const links = text.match(/<a class="sticker-pack__btn" href="(.+?)">/g);

        if (!links) {
            return [];
        }

        const results = links.map(link => link.match(/href="(.+?)"/)[1]);
        return results;
    } catch (error) {
        console.error('Error:', error.message);
        throw new Error('An error occurred while searching for stickers.');
    }
}

// Command to kang stickers
bot.onText(/\/kang (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const query = match[1];

    try {
        const stickerLinks = await searchStickerPacks(query);

        if (stickerLinks.length === 0) {
            bot.sendMessage(chatId, 'No stickers found for kang :(');
        } else {
            stickerLinks.forEach(async (stickerLink) => {
                try {
                    const stickerResponse = await fetch(stickerLink);
                    const stickerBuffer = await stickerResponse.buffer();

                    // Send the sticker to the chat
                    bot.sendSticker(chatId, stickerBuffer);
                } catch (error) {
                    console.error('Error fetching sticker:', error.message);
                }
            });
        }
    } catch (error) {
        console.error('Error:', error.message);
        bot.sendMessage(chatId, 'An error occurred while searching for stickers.');
    }
});

// Other bot functionalities...

console.log('Bot is running...');
