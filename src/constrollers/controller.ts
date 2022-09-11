import TelegramBot, { Message } from "node-telegram-bot-api";

import {
	notConnectKeyboard,
	defaultKeyboards,
	setSettingsKeyboard,
	setLanguagesKeyboard,
	setPhoneKeyboard,
} from "../keyboards/keyboards";
import { setStep, updateLang } from "../functions/functions";
import { queryRow } from "../lib/postgres";
import { User } from "../types/types";

import { startController } from "./start/start";
import { updatePhoneNumber } from "./contact/contact";

export async function Controller(msg: Message, bot: TelegramBot) {
	const chat_id: number = msg.chat.id;
	const user: User = await queryRow("SELECT * FROM users WHERE chat_id = $1", [chat_id]);
	if (msg.text === "/start") {
		if (!user) {
			await startController(msg, bot);
		} else {
			await bot.sendMessage(chat_id, "yuo are alredy register", {
				reply_markup: {
					keyboard: defaultKeyboards,
					resize_keyboard: true,
				},
			});
		}
	}
	// else if (user && msg.contact) {
	// 	await setPhoneNumber(msg, bot);
	// }
	else if (user && msg.text === "Settings") {
		await setStep(chat_id, "settings");
		await bot.sendMessage(chat_id, msg.text, {
			reply_markup: {
				keyboard: setSettingsKeyboard,
				resize_keyboard: true,
			},
		});
	} else if (user && msg.text === "Language") {
		await setStep(chat_id, "setLang");
		await bot.sendMessage(chat_id, msg.text, {
			reply_markup: {
				keyboard: setLanguagesKeyboard,
				resize_keyboard: true,
			},
		});
	} else if (user && msg.text?.split(" ")[1] === "Phone") {
		await setStep(chat_id, "updatePhone");
		await bot.sendMessage(chat_id, msg.text, {
			reply_markup: {
				keyboard: setPhoneKeyboard,
				resize_keyboard: true,
			},
		});
	} else if (user && user.step === "setLang") {
		await updateLang(msg, bot);
	} else if (user && user.step === "updatePhone") {
		await updatePhoneNumber(msg, bot);
	} else {
		if (!user) {
			await bot.sendMessage(
				chat_id,
				"Iltimos qaytadan ro'yxatdan o'ting,Ro'yxatdan o'tish uchun ⬇️ tugmani bosing ",
				{
					reply_markup: {
						keyboard: notConnectKeyboard,
						resize_keyboard: true,
					},
				}
			);
		} else if (!msg.contact) {
			await bot.sendMessage(
				chat_id,
				"Iltimos men bilan faqat buyruqlar va tugmalar orqali gaplashing",
				{
					reply_markup: {
						keyboard: defaultKeyboards,
						resize_keyboard: true,
					},
				}
			);
		}
	}
}
