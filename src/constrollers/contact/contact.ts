import TelegramBot, { Message } from "node-telegram-bot-api";

import { queryRow } from "../../lib/postgres";
import { setSettingsKeyboard } from "../../keyboards/keyboards";
import data from "../../locales/locales.json";
import { Translate, User } from "../../types/types";
import { saveStepMovement } from "../../functions/functions";

export async function setPhoneNumber(msg: Message, bot: TelegramBot) {
	const chat_id: number = msg.chat.id;
	const phone = msg.contact?.phone_number;
	await queryRow("UPDATE users SET phone_number = $2, current_step_id = $3 WHERE chat_id = $1", [
		chat_id,
		phone,
		3,
	]);

	const user: User = await queryRow("SELECT * FROM users WHERE chat_id = $1", [chat_id]);
	await saveStepMovement(chat_id, user.current_step_id, 3);

	const all: Translate = data[user.lang];
	//:TODO postgres update bo'lmasa ham error qaytmaydi shuni tekshirish

	await bot.sendMessage(chat_id, all.fullRegister.text, {
		reply_markup: {
			keyboard: setSettingsKeyboard,
			resize_keyboard: true,
		},
	});
}

export async function updatePhoneNumber(msg: Message, bot: TelegramBot) {
	const chat_id: number = msg.chat.id;
	const phone = msg.contact?.phone_number || msg.text;
	const user: User = await queryRow(
		"UPDATE users SET phone_number = $2 WHERE chat_id = $1 RETURNING *",
		[chat_id, phone]
	);
	await saveStepMovement(chat_id, user.current_step_id, 4);
	//:TODO postgres update bo'lmasa ham error qaytmaydi shuni tekshirish
	const all: Translate = data[user.lang];

	await bot.sendMessage(chat_id, all.language.success, {
		reply_markup: {
			keyboard: setSettingsKeyboard,
			resize_keyboard: true,
		},
	});
}
