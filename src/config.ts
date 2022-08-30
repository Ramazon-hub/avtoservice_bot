import "dotenv/config";

import { env } from "process";

const TOKEN: string | undefined = env.TOKEN;
const DB_CONNECTION: string | undefined = env.DB_CONNECTION;

export { TOKEN, DB_CONNECTION };
