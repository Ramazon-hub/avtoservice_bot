import TelegramBot, { Message } from "node-telegram-bot-api";

import data from "../locales/locales.json";
import { Keyboard, ServiceType, Translate, User } from "../types/types";
import { query, queryRow } from "../lib/postgres";
import { setPhoneKeyboard, setSettingsKeyboard } from "../keyboards/keyboards";

export async function setStep(chat_id: number, step_id: number): Promise<void> {
	await queryRow("UPDATE users SET current_step_id = $2 WHERE chat_id = $1", [chat_id, step_id]);
}

export async function saveStepMovement(
	chat_id: number,
	from_step_id: number,
	to_step_id: number,
	back = false
) {
	await queryRow(
		"INSERT INTO step_movements (from_step_id,to_step_id,chat_id,back) VALUES($1,$2,$3,$4)",
		[from_step_id, to_step_id, chat_id, back]
	);
}

export async function updateLang(msg: Message, bot: TelegramBot, user: User): Promise<void> {
	const chat_id: number = msg.chat.id;
	const lang = msg.text;
	const all: Translate = data[user.lang];

	await queryRow("UPDATE users SET lang = $2, current_step_id = $3 WHERE chat_id = $1", [
		chat_id,
		lang,
		4,
	]);
	//:TODO postgres update bo'lmasa ham error qaytmaydi shuni tekshirish

	await bot.sendMessage(chat_id, all.language.success, {
		reply_markup: {
			keyboard: setSettingsKeyboard,
			resize_keyboard: true,
		},
	});
}

export async function setServices(chat_id: number, bot: TelegramBot, user: User): Promise<void> {
	const service_types: Array<ServiceType> = await query("SELECT * FROM service_types");
	const service_types_array: Array<Keyboard> = [];
	const all: Translate = data[user.lang];
	service_types.forEach((service_type: ServiceType) =>
		service_types_array.push({ text: service_type[`title_${user.lang}`] })
	);
	service_types_array.push({ text: all.settings.text });
	await setStep(chat_id, 3);
	await saveStepMovement(chat_id, user.current_step_id, 3);
	const msg = user.phone_number ? all.fullRegister.text : all.start.notPhoneNumber;
	await bot.sendMessage(chat_id, msg, {
		reply_markup: {
			keyboard: [service_types_array],
			resize_keyboard: true,
		},
	});
}

//-------------------------------------------------------------------------------------------------------------------------------------------------------------
// KERAK BO'P QOLISHI MUMKIN DEB QOLDIRDIM KODLARNI QARAB YOZISHGA KEYN O'CHIRIB TASHLAYMIZ
// ------------------------------------------------------------------------------------------------------------------
export class Functions {
	static async setName(text: string | undefined, bot: TelegramBot, user: User): Promise<void> {
		await queryRow("UPDATE users SET first_name = $2, current_step = 2 WHERE chat_id = $1", [
			user.chat_id,
			text,
		]);
		//:TODO postgres update bo'lmasa ham error qaytmaydi shuni tekshirish
		await bot.sendMessage(
			user.chat_id,
			" Telefon  raqamingizni bizga yuborish  uchun ⬇️ tugmani bosing",
			{
				reply_markup: {
					keyboard: setPhoneKeyboard,
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
}
