const { Telegraf } = require('telegraf');
// Before:
// const fetch = require('node-fetch');

// After:
import fetch from 'node-fetch';

require('dotenv').config(); // Load environment variables from .env file

const botToken = process.env.TELEGRAM_BOT_TOKEN;
const bot = new Telegraf(botToken);

const combotStickersUrl = 'https://combot.org/telegram/stickers?q=';

// ... (Your other bot commands)

bot.command('fetchsticker', async (ctx) => {
    const split = ctx.message.text.split(' ');
    if (split.length === 1) {
        ctx.reply('Provide some name to fetch a sticker pack.');
        return;
    }

    const searchTerm = split[1];
    try {
        const stickerLinks = await fetchStickerLinks(searchTerm);
        if (stickerLinks.length === 0) {
            ctx.reply(`No stickers found for *${searchTerm}* :(`);
            return;
        }

        let reply = `Stickers fetched for *${searchTerm}*:\n`;
        for (let i = 0; i < stickerLinks.length; i++) {
            reply += `\n• [Sticker Pack ${i + 1}](${stickerLinks[i]})`;
        }

        ctx.replyWithMarkdown(reply);
    } catch (error) {
        console.error('Error:', error.message);
        ctx.reply('An error occurred while fetching stickers.');
    }
});

// Implement the rest of your functions...

bot.launch().then(() => {
    console.log('Bot is running...');
});
