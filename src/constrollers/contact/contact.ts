import TelegramBot, { Message } from "node-telegram-bot-api";

import { queryRow } from "../../lib/postgres";
import { setSettingsKeyboard } from "../../keyboards/keyboards";

export async function setPhoneNumber(msg: Message, bot: TelegramBot) {
	const chat_id: number = msg.chat.id;
	const phone = msg.contact?.phone_number;
	await queryRow("UPDATE users SET phone_number = $2, step = $3 WHERE chat_id = $1", [
		chat_id,
		phone,
		"setPhone",
	]);
	//:TODO postgres update bo'lmasa ham error qaytmaydi shuni tekshirish

	await bot.sendMessage(chat_id, "Register succesfull", {
		reply_markup: {
			keyboard: setSettingsKeyboard,
			resize_keyboard: true,
		},
	});
}

export async function updatePhoneNumber(msg: Message, bot: TelegramBot) {
	const chat_id: number = msg.chat.id;
	const phone = msg.contact?.phone_number || msg.text;

	await queryRow("UPDATE users SET phone_number = $2 WHERE chat_id = $1", [chat_id, phone]);
	//:TODO postgres update bo'lmasa ham error qaytmaydi shuni tekshirish

	await bot.sendMessage(chat_id, "Update succesfull", {
		reply_markup: {
			keyboard: setSettingsKeyboard,
			resize_keyboard: true,
		},
	});
}
