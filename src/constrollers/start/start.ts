import TelegramBot, { Message } from "node-telegram-bot-api";

import { queryRow } from "../../lib/postgres";
import { setPhoneKeyboard } from "../../keyboards/keyboards";
import data from "../../locales/locales.json";
import { Translate, User } from "../../types/types";
import { saveStepMovement } from "../../functions/functions";

export async function startController(msg: Message, bot: TelegramBot): Promise<void> {
	const chat_id: number = msg.chat.id;

	const user: User = await queryRow(
		"INSERT INTO users (chat_id,lang,first_name,last_name,username,current_step_id) VALUES($1,$2,$3,$4,$5,$6) RETURNING *",
		[
			chat_id,
			msg.from?.language_code,
			msg.from?.first_name,
			msg.from?.last_name,
			msg.from?.username,
			2,
		]
	);

	await saveStepMovement(chat_id, user.current_step_id, 3);
	const all: Translate = data[user.lang];

	await bot.sendMessage(chat_id, all.start.text, {
		reply_markup: {
			keyboard: setPhoneKeyboard,
			resize_keyboard: true,
		},
	});

	// return await bot.sendMessage(chatID, locales.initial.text, sendMsg("initial.text"));
}
