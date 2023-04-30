import { openai } from './openai.js'

// Создаем объект-константу, содержащий начальные данные сессии бота
export const INITIAL_SESSION = {
	messages: [
		{
			role: 'system',
			content: 'СИСТЕМНОЕ СООБЩЕНИЕ, КОТОРОЕ ЗАДАЕТ ПОВЕДЕНИЕ БОТА (ТРЕЙДЕР, ПАРФЮМЕР, ГОПНИК И ТД)'
		}
	]
}

// Функция, которая инициализирует сессию бота
export async function initCommand(ctx) {
	// Устанавливаем начальное значение для ctx.session
	await ctx.reply(`Привет ${ctx.message.from.first_name}! Привет!`, {
		reply_markup: {
			keyboard: [[{ text: 'Кнопка1' }, { text: 'Кнопка2' }]],
			resize_keyboard: true,
			one_time_keyboard: true
		}
	})
}

export async function resetCommand(ctx) {
	// Устанавливаем начальное значение для ctx.session
	ctx.session = {
		messages: [
			{
				role: 'system',
				content:
					'ТУТ Я ОБНУЛЯЮ КОНТЕКСТ СООБЩЕНИЕМ ИЗ ИНИТИАЛ ПЕРЕМЕННОЙ – СИСТЕМНОЕ СООБЩЕНИЕ, КОТОРОЕ ЗАДАЕТ ПОВЕДЕНИЕ БОТА (ТРЕЙДЕР, ПАРФЮМЕР, ГОПНИК И ТД)'
			}
		]
	}
	// Отправляем сообщение пользователю
	await ctx.reply('Контекст успешно обнулен. Можете продолжать им пользоваться')
}

// Функция, которая обрабатывает текстовые сообщения от пользователя
export async function processTextToChat(ctx, content) {
	try {
		// Сохраняем текстовое сообщение пользователя в массив сообщений
		ctx.session.messages.push({ role: openai.roles.USER, content })

		// Отправляем текстовое сообщение в OpenAI и получаем ответ
		const response = await openai.chat(ctx.session.messages)

		// Сохраняем ответ от OpenAI в массив сообщений
		ctx.session.messages.push({
			role: openai.roles.ASSISTANT,
			content: response.content
		})

		// Отправляем ответ пользователю
		await ctx.reply(response.content)
	} catch (e) {
		// Если произошла ошибка при обработке сообщения в OpenAI, выводим сообщение в консоль
		await ctx.reply(code(`Случилась ошибка: ${e}. Попробуй написать /reset`))
	}
}
