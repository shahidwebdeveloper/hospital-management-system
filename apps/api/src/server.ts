import { env } from "./config/env.js";
import { connectDatabase } from "./config/database.js";
import { createApp } from "./app.js";

const app = createApp();

async function bootstrap() {
  await connectDatabase();

  app.listen(env.PORT, () => {
    console.log(`HMS API running on http://localhost:${env.PORT}/api/${env.API_VERSION}`);
  });
}

void bootstrap();
