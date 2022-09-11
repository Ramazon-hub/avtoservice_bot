import TelegramBot from "node-telegram-bot-api";

import { setPhoneNumber } from "./constrollers/contact/contact";
import { TOKEN } from "./config";
import { Controller } from "./constrollers/controller";

const bot: TelegramBot = new TelegramBot(TOKEN as string, { polling: true });

function main() {
	// eslint-disable-next-line @typescript-eslint/no-misused-promises
	bot.on("message", async function (msg: TelegramBot.Message): Promise<void> {
		await Controller(msg, bot);
	});
	// eslint-disable-next-line @typescript-eslint/no-misused-promises
	bot.on("contact", async function (msg: TelegramBot.Message): Promise<void> {
		await setPhoneNumber(msg, bot);
	});
}

main();
