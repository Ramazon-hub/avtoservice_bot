import TelegramBot from "node-telegram-bot-api";

import { Keyboard, ServiceType, User } from "types/types";

import { query, queryRow } from "../lib/postgres";
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

	static async authenticate(
		first_name: string | undefined,
		last_name: string | undefined,
		username: string | undefined,
		language_code: string | undefined,
		bot: TelegramBot,
		chat_id: number
	): Promise<void> {
		await queryRow(
			"INSERT INTO users (chat_id,lang,first_name,last_name,username) VALUES($1,$2,$3,$4,$5)",
			[chat_id, language_code, first_name, last_name, username]
		);
		await bot.sendMessage(
			chat_id,
			"Assalom alekum botimizga xush kelibsiz! Telefon raqamingizni bizga yuborish  uchun ⬇️ tugmani bosing",
			{
				reply_markup: {
					keyboard: Keyboards.setPhoneKeyboard,
					resize_keyboard: true,
				},
			}
		);
	}

	static async setServices(chat_id: number, bot: TelegramBot, user: User) {
		const service_types: Array<ServiceType> = await query("SELECT * FROM service_types");
		const service_types_array: Array<Keyboard> = [];
		user;
		service_types.forEach((service_type: ServiceType) =>
			service_types_array.push({ text: service_type.title_uz })
		);
		service_types_array.push({ text: "Settings" });
		await bot.sendMessage(
			chat_id,
			"Siz ro'yxatdan oz'gansiz! Xizmatlardan foydalanishingiz mumkin.",
			{
				reply_markup: {
					keyboard: [service_types_array],
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
