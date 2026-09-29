import { app } from "./app.js";
import { env } from "./config/env.js";

app.listen(env.PORT, () => {
  console.info(`Personal Chat Assistant API listening on port ${env.PORT}`);
});
