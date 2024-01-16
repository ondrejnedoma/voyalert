import { dirname } from "path";
import { fileURLToPath } from "url";
import * as fs from "fs";

export const i18nGetPath = () => {
  return dirname(fileURLToPath(import.meta.url));
};
