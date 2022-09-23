import TelegramBot, { Message } from "node-telegram-bot-api";

import {
	notConnectKeyboard,
	setSettingsKeyboard,
	setLanguagesKeyboard,
	setPhoneKeyboard,
	updateLangKeyboard,
} from "../keyboards/keyboards";
import { saveStepMovement, setServices, setStep, updateLang } from "../functions/functions";
import { queryRow } from "../lib/postgres";
import { StepMovements, Translate, User } from "../types/types";
import data from "../locales/locales.json";

import { startController } from "./start/start";
import { updatePhoneNumber } from "./contact/contact";

export async function Controller(msg: Message, bot: TelegramBot) {
	const chat_id: number = msg.chat.id;
	const user: User = await queryRow("SELECT * FROM users WHERE chat_id = $1", [chat_id]);
	if (msg.text === "/start") {
		if (!user) {
			await startController(msg, bot);
		} else {
			await setServices(chat_id, bot, user);
		}
	} else if (user && msg.text === "Settings") {
		const all: Translate = data[user.lang];
		await setStep(chat_id, 4);
		await saveStepMovement(chat_id, user.current_step_id, 4);
		await bot.sendMessage(chat_id, all.settings.reply, {
			reply_markup: {
				keyboard: setSettingsKeyboard,
				resize_keyboard: true,
			},
		});
	} else if (user && msg.text === "back") {
		const step_movement: StepMovements = await queryRow(
			"SELECT * FROM step_movements WHERE to_step_id = $1 AND back = false AND chat_id = $2 ORDER BY id DESC LIMIT 1",
			[user.current_step_id, chat_id]
		);
		const all: Translate = data[user.lang];

		if (step_movement.from_step_id === 2) {
			await bot.sendMessage(chat_id, all.settings.reply, {
				reply_markup: {
					keyboard: setPhoneKeyboard,
					resize_keyboard: true,
				},
			});
		}
		if (step_movement.from_step_id === 3) {
			await setServices(chat_id, bot, user);
		}
		if (step_movement.from_step_id === 4 || step_movement.from_step_id === 6) {
			await bot.sendMessage(chat_id, all.settings.reply, {
				reply_markup: {
					keyboard: setSettingsKeyboard,
					resize_keyboard: true,
				},
			});
		}
		await setStep(chat_id, step_movement.from_step_id);
		await saveStepMovement(chat_id, user.current_step_id, step_movement.from_step_id, true);
	} else if (user && user.current_step_id === 4 && msg.text === "Language") {
		await setStep(chat_id, 5);
		await saveStepMovement(chat_id, user.current_step_id, 5);
		const all: Translate = data[user.lang];
		await bot.sendMessage(chat_id, all.language.text, {
			reply_markup: {
				keyboard: setLanguagesKeyboard,
				resize_keyboard: true,
			},
		});
	} else if (user && msg.text?.split(" ")[1] === "Phone") {
		await setStep(chat_id, 6);
		await saveStepMovement(user.chat_id, user.current_step_id, 6);
		await bot.sendMessage(chat_id, msg.text, {
			reply_markup: {
				keyboard: updateLangKeyboard,
				resize_keyboard: true,
			},
		});
	} else if (user && user.current_step_id === 5) {
		await updateLang(msg, bot, user);
	} else if (user && user.current_step_id === 6) {
		await updatePhoneNumber(msg, bot);
	} else if (user && user.current_step_id === 3) {
		await setServices(chat_id, bot, user);
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
				"Iltimos men bilan faqat buyruqlar va tugmalar orqali gaplashing"
			);
		}
	}
}
