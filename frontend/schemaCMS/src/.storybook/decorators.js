import React from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider, Theme } from 'schemaUI';
import { IntlProvider } from 'react-intl';
import { MemoryRouter } from 'react-router';
import { translationMessages, DEFAULT_LOCALE } from '../i18n';


export const withTheme = (theme = Theme.dark) => (story) => (
  <ThemeProvider theme={theme}>{story()}</ThemeProvider>
);

export const withStore = (initialState) => (story) => (
  <Provider store={initialState}>
    {story()}
  </Provider>
);

export const withIntl = (story) => (
  <IntlProvider locale={DEFAULT_LOCALE} messages={translationMessages[DEFAULT_LOCALE]}>
    {story()}
  </IntlProvider>
);

export const withRouter = story => (
  <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
);

