import { Telegraf, session } from 'telegraf'
import { message } from 'telegraf/filters'
import { code } from 'telegraf/format'
import config from 'config'
import { ogg } from './ogg.js'
import { openai } from './openai.js'
import { removeFile } from './utils.js'
import { initCommand, processTextToChat, INITIAL_SESSION, resetCommand } from './logic.js'
import { kbCallback, kbInline } from './buttons.js'

const bot = new Telegraf(config.get('TELEGRAM_TOKEN'))

bot.use(session())

bot.command('start', initCommand)
bot.command('reset', resetCommand)
bot.command('testCallback', kbCallback)
bot.hears('Регламенты', kbInline)

bot.on(message('voice'), async ctx => {
	ctx.session ??= INITIAL_SESSION
	try {
		await ctx.reply(code('Сообщение принял, сейчас расшифрую...'))
		const link = await ctx.telegram.getFileLink(ctx.message.voice.file_id)
		const userId = String(ctx.message.from.id)
		const oggPath = await ogg.create(link.href, userId)
		const mp3Path = await ogg.toMp3(oggPath, userId)

		removeFile(oggPath)

		const text = await openai.transcription(mp3Path)
		await ctx.reply(code(`Ваш запрос: ${text}`))

		await processTextToChat(ctx, text)
	} catch (e) {
		await ctx.reply(code(`Случилась ошибка: ${e}. Попробуй написать /reset`))
	}
})

bot.on(message('text'), async ctx => {
	ctx.session ??= INITIAL_SESSION
	try {
		await ctx.reply(code('Сообщение принял. Немного подождите...⏳'))
		await processTextToChat(ctx, ctx.message.text)
	} catch (e) {
		await ctx.reply(code(`Случилась ошибка: ${e}. Попробуй написать /reset`))
	}
})

bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

export { bot }
