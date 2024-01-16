import { dirname } from "path";
import { fileURLToPath } from "url";

export default function i18nGetPath() {
  return dirname(fileURLToPath(import.meta.url));
}
