import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { env } from "../env.js";
import * as schema from "./schema.js";

// MySQLのタイムゾーン設定は無視され、JSTでの日時管理はlib/dates.tsで行う
const pool = mysql.createPool({ uri: env.DATABASE_URL });

export const db = drizzle(pool, { schema, mode: "default" });
