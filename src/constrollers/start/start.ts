import TelegramBot, { Message } from "node-telegram-bot-api";

import { queryRow } from "../../lib/postgres";
import { setPhoneKeyboard } from "../../keyboards/keyboards";

export async function startController(msg: Message, bot: TelegramBot): Promise<void> {
	const chat_id: number = msg.chat.id;
	await queryRow(
		"INSERT INTO users (chat_id,lang,first_name,last_name,username,step) VALUES($1,$2,$3,$4,$5,$6)",
		[
			chat_id,
			msg.from?.language_code,
			msg.from?.first_name,
			msg.from?.last_name,
			msg.from?.username,
			"started",
		]
	);

	await bot.sendMessage(
		chat_id,
		"Assalom alekum botimizga xush kelibsiz! Telefon raqamingizni bizga yuborish  uchun ⬇️ tugmani bosing",
		{
			reply_markup: {
				keyboard: setPhoneKeyboard,
				resize_keyboard: true,
			},
		}
	);

	// return await bot.sendMessage(chatID, locales.initial.text, sendMsg("initial.text"));
}
