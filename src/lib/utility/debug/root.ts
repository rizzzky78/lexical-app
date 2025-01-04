import fs from "fs";
import logger from "../logger/root";

export const _debugHelper = (name: string, payload: any) => {
  fs.writeFileSync(
    `./src/debug/state/${name}.json`,
    JSON.stringify(payload, null, 2)
  );
  logger.info(`DEBUG: <${name}> saved!`);
};
