import React from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { ThemeProvider as ThemeProviderUI, Theme } from 'schemaUI';
import { IntlProvider } from 'react-intl';
import { MemoryRouter } from 'react-router';

import { translationMessages, DEFAULT_LOCALE } from '../i18n';
import { ROLES } from '../modules/userProfile/userProfile.constants';
import { UserContext } from '../shared/utils/userProvider';

const getStyles = theme => `
  body {
    color: ${theme.text};
    background-color: ${theme.background};
  }
`;

export const withTheme = (theme = Theme.dark) => story => (
  <UserContext.Provider value={{ role: ROLES.ADMIN }}>
    <ThemeProvider theme={theme}>
      <ThemeProviderUI theme={theme}>
        <style>{getStyles(theme)}</style>
        {story()}
      </ThemeProviderUI>
    </ThemeProvider>
  </UserContext.Provider>
);

export const withStore = initialState => story => <Provider store={initialState}>{story()}</Provider>;

export const withIntl = story => (
  <IntlProvider locale={DEFAULT_LOCALE} messages={translationMessages[DEFAULT_LOCALE]}>
    {story()}
  </IntlProvider>
);

export const withRouter = story => <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>;
