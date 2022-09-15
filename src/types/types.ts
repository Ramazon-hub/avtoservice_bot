import data from "../locales/locales.json";

export interface User {
	id: number;
	chat_id: number;
	firt_name: string;
	last_name: string;
	username: string;
	phone_number: string;
	lang: keyof typeof data;
	step: string;
}

export interface ServiceType {
	id: number;
	title_uz: string;
	title_ru: string;
	title_en: string;
}
export interface Keyboard {
	text: string;
}
