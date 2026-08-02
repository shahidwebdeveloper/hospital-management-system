import { MongoClient } from "mongodb";

import { env } from "../config/env.js";

export const client = new MongoClient(env.MONGODB_URI);
export const db = client.db(env.MONGODB_DB_NAME);
export const authDb = client.db(env.MONGODB_AUTH_DB_NAME);

export async function connectAuthDatabase() {
  await client.connect();
}
