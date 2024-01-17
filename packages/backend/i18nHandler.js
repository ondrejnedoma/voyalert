import i18next from "i18next";
import i18nextMiddleware from "i18next-http-middleware";
import resources from "./i18n-resources.json" assert { type: "json" };

i18next.use(i18nextMiddleware.LanguageDetector).init({
  resources,
  fallbackLng: "en",
  load: "languageOnly",
});

export const i18nRegister = (app) => {
  app.use(i18nextMiddleware.handle(i18next));
};
