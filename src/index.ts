import TelegramBot from "node-telegram-bot-api";

import { TOKEN } from "./config";
import { Controllers } from "./constrollers/controllers";

const bot: TelegramBot = new TelegramBot(TOKEN as string, { polling: true });

function main() {
	// eslint-disable-next-line @typescript-eslint/no-misused-promises
	bot.on("text", async function (msg: TelegramBot.Message): Promise<void> {
		await Controllers.messageController(msg, bot);
	});
	// eslint-disable-next-line @typescript-eslint/no-misused-promises
	bot.on("contact", async function (msg: TelegramBot.Message): Promise<void> {
		await Controllers.contactController(msg, bot);
	});
}

main();
