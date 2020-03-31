import { Router } from 'react-router';
import { IntlProvider } from 'react-intl';
import { act, create } from 'react-test-renderer';
import React from 'react';
import { ThemeProvider } from 'styled-components';
import { Theme } from 'schemaUI';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';

import { DEFAULT_LOCALE, translationMessages } from '../../i18n';
import browserHistory from './history';
import configureStore from '../../modules/store';
import { ROLES } from '../../modules/userProfile/userProfile.constants';
import { UserContext } from './userProvider';

const { store } = configureStore({});

const ProvidersWrapper = ({ children }) => (
  <Provider store={store}>
    <Router history={browserHistory}>
      <IntlProvider locale={DEFAULT_LOCALE} messages={translationMessages[DEFAULT_LOCALE]}>
        <UserContext.Provider value={{ role: ROLES.ADMIN }}>
          <ThemeProvider theme={Theme.dark}>{children}</ThemeProvider>
        </UserContext.Provider>
      </IntlProvider>
    </Router>
  </Provider>
);

ProvidersWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export const makeContextRenderer = async component => {
  let wrapper = null;

  await act(async () => {
    wrapper = await create(<ProvidersWrapper>{component}</ProvidersWrapper>);
  });

  return wrapper;
};
