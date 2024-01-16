import {getLocales} from 'react-native-localize';
import i18next from 'i18next';
import {initReactI18next} from 'react-i18next';
import Backend from 'i18next-fs-backend';

i18next
  .use(initReactI18next)
  .use(Backend)
  .init({
    backend: {
      loadPath: path.join(i18nPath + '/languages/{{lng}}/{{ns}}.json'),
      addPath: path.join(i18nPath + '/languages/{{lng}}/{{ns}}.missing.json'),
    },
    fallbackLng: 'en',
  });
