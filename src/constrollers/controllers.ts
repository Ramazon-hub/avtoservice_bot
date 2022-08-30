import TelegramBot, { Contact, Message } from "node-telegram-bot-api";

import { queryRow } from "../lib/postgres";
import { Functions } from "../functions/functions";
import { User } from "../types/types";

export class Controllers {
	static async messageController(msg: Message, bot: TelegramBot): Promise<void> {
		const chat_id: number = msg.chat.id;
		const user: User = await queryRow("SELECT * FROM users WHERE chat_id = $1", [chat_id]);
		if (!user) {
			await queryRow("INSERT INTO users (chat_id) VALUES($1)", [chat_id]);
			await bot.sendMessage(
				chat_id,
				"Assalom alekum botimizga xush kelibsiz.Iltimos ismingizni kiriting !"
			);
		} else if (user.step === 1 && msg.text?.trim()) {
			await Functions.setName(msg.text, bot, user);
		} else if (user.step === 3) {
			await bot.sendMessage(
				chat_id,
				"Siz ro'yxatdan o'tgansiz xizmatlarimizdan foydalanishingiz mumkin. "
			);
		} else {
			await bot.sendMessage(
				chat_id,
				"Men sizni tushunmadim . /n Iltimos men bilan faqat buyruqlar orqali gaplashing. /n /start"
			);
		}
	}

	static async contactController(msg: Message, bot: TelegramBot) {
		const chat_id: number = msg.chat.id;
		const contact: Contact | undefined = msg.contact;
		const user: User = await queryRow("SELECT * FROM users WHERE chat_id = $1", [chat_id]);
		if (!user) {
			await bot.sendMessage(
				chat_id,
				"Iltimos botdan foydalanish uchun avval ro'yxatdan o'ting /n /start"
			);
		} else if (user.step === 2 && contact !== undefined) {
			await Functions.setPhoneNumber(contact.phone_number, bot, user);
		}
	}
}
