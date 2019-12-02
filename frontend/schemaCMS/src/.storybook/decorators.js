import React from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { ThemeProvider as ThemeProviderUI, Theme } from 'schemaUI';
import { IntlProvider } from 'react-intl';
import { MemoryRouter } from 'react-router';

import { translationMessages, DEFAULT_LOCALE } from '../i18n';
import { prepareFontSet } from '../../../schemaUI/.storybook/fonts';

const baseStyles = (theme) => ({
  color: theme.text,
  fontFamily: ''
})

export const withTheme = (theme = Theme.dark) => (story) => (
  <ThemeProvider theme={theme}>
    <ThemeProviderUI theme={theme}>
      <style>{prepareFontSet()}</style>
      <div style={{ color: theme.text, fontFamily: 'Inter' }}>{story()}</div>
    </ThemeProviderUI>
  </ThemeProvider>
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

