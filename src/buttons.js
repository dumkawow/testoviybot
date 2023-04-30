import { bot } from './main.js'

export async function kbInline(ctx) {
	// Создаем объект с параметрами inline-кнопок
	const keyboardInline = {
		reply_markup: {
			inline_keyboard: [
				[
					{
						text: 'текст',
						url: 'ya.ru'
					},
					{
						text: 'текс',
						url: 'google.com'
					}
				]
			]
		}
	}

	// Отправляем сообщение с inline-кнопками
	await ctx.reply(`${ctx.message.from.first_name}, выбери регламент:`, keyboardInline)
}

export async function kbCallback(ctx) {
	bot.action('like', ctx => {
		ctx.reply('Вы нажали кнопку "Нравится"')
	})

	bot.action('dislike', ctx => {
		ctx.reply('Вы нажали кнопку "Не нравится"')
	})
	const keyboardCallback = {
		reply_markup: {
			inline_keyboard: [
				[
					{ text: 'Нравится', callback_data: 'like' },
					{ text: 'Не нравится', callback_data: 'dislike' }
				]
			]
		}
	}

	// Отправляем сообщение с callback-кнопками
	await ctx.reply('Нажмите на кнопку:', keyboardCallback)
}
