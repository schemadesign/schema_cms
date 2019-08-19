import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { IntlProvider } from 'react-intl';

import browserHistory from '../shared/utils/history';
import App from './app.container';
import AuthRoute from './authRoute/authRoute.container';
import { DEFAULT_LOCALE, translationMessages } from '../i18n';
import { Home } from './home';
import { NotFound } from './notFound';
import { AUTH_PATH } from '../shared/utils/api.constants';

export const ROUTES = {
  HOME: '/',
  NOT_FOUND: '/404',
};

export default class RootContainer extends Component {
  render() {
    return (
      <App>
        <Switch>
          <AuthRoute exact path={ROUTES.HOME} component={Home} />

          <Route exact path="/login" render={() => browserHistory.push(AUTH_PATH)} />

          <IntlProvider locale={DEFAULT_LOCALE} messages={translationMessages[DEFAULT_LOCALE]}>
            <Route component={NotFound} />
          </IntlProvider>
        </Switch>
      </App>
    );
  }
}
