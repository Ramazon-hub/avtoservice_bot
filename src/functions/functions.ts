import TelegramBot from "node-telegram-bot-api";

import { User } from "types/types";

import { queryRow } from "../lib/postgres";
import { Keyboards } from "../keyboards/keyboards";

export class Functions {
	static async setName(text: string | undefined, bot: TelegramBot, user: User): Promise<void> {
		await queryRow("UPDATE users SET full_name = $2, step = 2 WHERE chat_id = $1", [
			user.chat_id,
			text,
		]);
		//:TODO postgres update bo'lmasa ham error qaytmaydi shuni tekshirish
		await bot.sendMessage(
			user.chat_id,
			"Ro'yxatdan o'tish ! /n  1) Ism-familya ✅ \\n 2) Telefon  raqamingizni bizga yuborish  uchun ⬇️ tugmani bosing",
			{
				reply_markup: {
					keyboard: Keyboards.setPhoneKeyboard,
					resize_keyboard: true,
				},
			}
		);
	}

	static async setPhoneNumber(phone: string, bot: TelegramBot, user: User) {
		await queryRow("UPDATE users SET phone_number = $2, step = 3 WHERE chat_id = $1", [
			user.chat_id,
			phone,
		]);
		//:TODO postgres update bo'lmasa ham error qaytmaydi shuni tekshirish
		await bot.sendMessage(user.chat_id, "Register succesfull", {
			reply_markup: {
				remove_keyboard: true,
			},
		});
	}

	// static async setBack(bot: TelegramBot, chat_id: number): Promise<void> {
	// 	await bot.sendMessage(chat_id, "Back", {
	// 		reply_markup: {
	// 			keyboard: Keyboards.setBackKeyboard,
	// 			resize_keyboard: true,
	// 		},
	// 	});
	// }

	static async setLangKeyboards(bot: TelegramBot, chat_id: number): Promise<void> {
		await bot.sendMessage(chat_id, "Tilni tanlang", {
			reply_markup: {
				keyboard: Keyboards.setLanguagesKeyboard,
				resize_keyboard: true,
			},
		});
	}

	// static async setLanguage(lang: string,bot: TelegramBot,user: User) {

	// }
}
