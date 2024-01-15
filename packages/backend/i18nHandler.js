import path from "path";
import i18next from "i18next";
import i18nextMiddleware from "i18next-http-middleware";
import Backend from "i18next-fs-backend";

const i18nModulePath = new URL("@voyalert/i18n", import.meta.url).pathname;

i18next
  .use(Backend)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    backend: {
      loadPath: path.join(i18nModulePath + "{{lng}}/{{ns}}.json"),
      addPath: path.join(i18nModulePath + "{{lng}}/{{ns}}.missing.json"),
    },
    fallbackLng: "en",
    load: "languageOnly",
    saveMissing: true,
  });

export const i18nRegister = (app) => {
  app.use(i18nextMiddleware.handle(i18next));
};
