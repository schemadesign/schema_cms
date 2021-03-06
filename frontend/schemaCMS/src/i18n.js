import '@formatjs/intl-pluralrules/polyfill';
import '@formatjs/intl-pluralrules/dist/locale-data/en';

import enTranslationMessages from './translations/en.json';

export const LOCALES = {
  ENGLISH: 'en',
};

export const DEFAULT_LOCALE = LOCALES.ENGLISH;

export const appLocales = [LOCALES.ENGLISH];

export const formatTranslationMessages = (locale, messages) => {
  const defaultFormattedMessages =
    locale !== DEFAULT_LOCALE ? formatTranslationMessages(DEFAULT_LOCALE, enTranslationMessages) : {};
  return Object.keys(messages).reduce((formattedMessages, key) => {
    const formattedMessage =
      !messages[key] && locale !== DEFAULT_LOCALE ? defaultFormattedMessages[key] : messages[key];
    return Object.assign(formattedMessages, { [key]: formattedMessage });
  }, {});
};

export const translationMessages = {
  [LOCALES.ENGLISH]: formatTranslationMessages(LOCALES.ENGLISH, enTranslationMessages),
};
