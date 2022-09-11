import TelegramBot, { Contact, Message } from "node-telegram-bot-api";

import { queryRow } from "../lib/postgres";
import { Functions } from "../functions/functions";
import { User } from "../types/types";
import { Keyboards } from "../keyboards/keyboards";

export class Controllers {
	static async messageController(msg: Message, bot: TelegramBot): Promise<void> {
		const chat_id: number = msg.chat.id;
		const user: User = await queryRow("SELECT * FROM users WHERE chat_id = $1", [chat_id]);
		if (msg.text === "/start") {
			if (!user) {
				await Functions.authenticate(
					msg.from?.first_name,
					msg.from?.last_name,
					msg.from?.username,
					msg.from?.language_code,
					bot,
					chat_id
				);
			} else {
				await Functions.setServices(chat_id, bot, user);
			}
		} else if (
			user.step === 1 &&
			msg.text !== "Settings" &&
			msg.text !== "/start" &&
			msg.text?.trim()
		) {
			await Functions.setName(msg.text, bot, user);
		} else if (user.step === 3 && msg.text !== "Settings") {
			await bot.sendMessage(
				chat_id,
				"Siz ro'yxatdan o'tgansiz xizmatlarimizdan foydalanishingiz mumkin. "
			);
		} else if (msg.text === "Settings") {
			await Functions.setLangKeyboards(bot, user.chat_id);
		} else if (msg.text === "Back") {
			console.log("back");
		} else if (user.step === 1) {
			await bot.sendMessage(chat_id, "Iltimos ismingizni kiriting!");
		} else if (msg.text?.split("_")[0] === "lang") {
			await queryRow("UPDATE users SET lang = $2 WHERE chat_id = $1", [
				chat_id,
				msg.text?.split("_")[1],
			]);
			await bot.sendMessage(chat_id, "✅ o'zgartirildi");
		} else if (msg.text === "back") {
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
		} else {
			await bot.sendMessage(
				chat_id,
				"Men sizni tushunmadim . /n Iltimos men bilan faqat buyruqlar orqali gaplashing. /n /start"
			);
		}

		await bot.setMyCommands([{ command: "/start", description: "Boshlash" }]);
	}

	static async contactController(msg: Message, bot: TelegramBot) {
		const chat_id: number = msg.chat.id;
		const contact: Contact | undefined = msg.contact;
		const user: User = await queryRow("SELECT * FROM users WHERE chat_id = $1", [chat_id]);
		if (user.step === 1 && contact !== undefined) {
			await Functions.setPhoneNumber(contact.phone_number, bot, user);
		}
	}
}
