import data from "../locales/locales.json";

export interface User {
	id: number;
	chat_id: number;
	firt_name: string;
	last_name: string;
	username: string;
	phone_number: string;
	lang: keyof typeof data;
	current_step_id: number;
}

export interface ServiceType {
	id: number;
	title_uz: string;
	title_ru: string;
	title_en: string;
}

export interface StepMovements {
	id: number;
	from_step_id: number;
	to_step_id: number;
	back: boolean;
	chat_id: number;
	created_at: Date;
}
export interface Keyboard {
	text: string;
}

export type Translate = {
	start: {
		text: string;
		warning_text: string;
		stiker: string;
		notPhoneNumber: string;
	};
	settings: {
		text: string;
		reply: string;
	};
	fullRegister: {
		text: string;
	};
	language: {
		text: string;
		success: string;
	};
};
