import fs from "fs";
import logger from "../logger/root";

export const _debugHelper = (name: string, payload: any) => {
  fs.writeFileSync(`./src/debug/state/${name}.json`, JSON.stringify(payload));
  logger.info(`DEBUG: <${name}> saved!`);
};
