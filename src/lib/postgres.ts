import {Pool,QueryResultRow} from "pg";

import { DB_CONNECTION } from "../config";

const pool = new Pool({ connectionString: DB_CONNECTION});

export async function query<Row  extends  QueryResultRow, I extends Array<unknown> = Array<unknown>>(
	queryText: string,
	values?: I
): Promise<Array<Row>> {
	const client = await pool.connect();
	const { rows } = await client.query<Row, I>(queryText, values);
	client.release();
	return rows;
}

export async function queryRow<Row extends QueryResultRow, I extends Array<unknown> = Array<unknown>>(
	queryText: string,
	values?: I
): Promise<Row> {
	const [row] = await query<Row, I>(queryText, values);
	return row;
}
