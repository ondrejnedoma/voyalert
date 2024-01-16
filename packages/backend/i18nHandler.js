import path from "path";
import i18next from "i18next";
import i18nextMiddleware from "i18next-http-middleware";
import Backend from "i18next-fs-backend";

import i18nGetPath from "@voyalert/i18n";
const i18nPath = i18nGetPath();

i18next
  .use(Backend)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    backend: {
      loadPath: path.join(i18nPath + "/{{lng}}/{{ns}}.json"),
      addPath: path.join(i18nPath + "/{{lng}}/{{ns}}.missing.json"),
    },
    fallbackLng: "en",
    load: "languageOnly",
    saveMissing: true,
  });

export const i18nRegister = (app) => {
  app.use(i18nextMiddleware.handle(i18next));
};
