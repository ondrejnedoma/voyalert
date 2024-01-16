import 'intl-pluralrules';
import i18next from 'i18next';
import {initReactI18next} from 'react-i18next';
import resources from '../../i18n-resources.json';

i18next.use(initReactI18next).init({
  react: {
    useSuspense: false,
  },
  resources,
  fallbackLng: 'en',
  load: 'languageOnly',
});
