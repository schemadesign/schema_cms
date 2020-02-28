import { Router } from 'react-router';
import { IntlProvider } from 'react-intl';
import { act, create } from 'react-test-renderer';
import React from 'react';
import { ThemeProvider } from 'styled-components';
import { Theme } from 'schemaUI';
import PropTypes from 'prop-types';

import { DEFAULT_LOCALE, translationMessages } from '../../i18n';
import browserHistory from './history';

const ProvidersWrapper = ({ children }) => (
  <Router history={browserHistory}>
    <IntlProvider locale={DEFAULT_LOCALE} messages={translationMessages[DEFAULT_LOCALE]}>
      <ThemeProvider theme={Theme.dark}>{children}</ThemeProvider>
    </IntlProvider>
  </Router>
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
