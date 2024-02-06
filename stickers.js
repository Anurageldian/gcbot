const { Telegraf } = require('telegraf');
const fetch = require('node-fetch');

const botToken = '6718509055:AAFkvdnx2lx2FIY0-1_IymVpT2E3wQc8bfI';
const bot = new Telegraf(botToken);

const combotStickersUrl = 'https://combot.org/telegram/stickers?q=';

bot.command('stickerid', (ctx) => {
    try {
        const sticker = ctx.message.reply_to_message && ctx.message.reply_to_message.sticker;
        if (sticker) {
            ctx.replyWithHTML(
                `Hello ${ctx.from.first_name}, The sticker id you are replying is:\n<code>${sticker.file_id}</code>`
            );
        } else {
            ctx.replyWithHTML(
                `Hello ${ctx.from.first_name}, Please reply to a sticker message to get the sticker ID`
            );
        }
    } catch (error) {
        console.error('Error in stickerid command:', error);
        ctx.reply('An error occurred while processing the command.');
    }
});

bot.command('stickers', async (ctx) => {
    try {
        const split = ctx.message.text.split(' ');
        if (split.length === 1) {
            ctx.reply('Provide some name to search for a pack.');
            return;
        }

        const searchTerm = split[1];
        const response = await fetch(combotStickersUrl + searchTerm);
        const text = await response.text();
        const titles = text.match(/<div class="sticker-pack__title">(.+?)<\/div>/g);
        const links = text.match(/<a class="sticker-pack__btn" href="(.+?)">/g);

        if (!titles || !links) {
            ctx.reply('No results found :(');
            return;
        }

        let reply = `Stickers for *${searchTerm}*:\n`;
        for (let i = 0; i < Math.min(titles.length, links.length); i++) {
            const title = titles[i].replace(/<\/?div>/g, '');
            const link = links[i].match(/href="(.+?)"/)[1];
            reply += `\n• [${title}](${link})`;
        }

        ctx.replyWithMarkdown(reply);
    } catch (error) {
        console.error('Error in stickers command:', error);
        ctx.reply('An error occurred while processing the command.');
    }
});

// Implement the rest of your functions...

bot.launch().then(() => {
    console.log('Bot is running...');
});
