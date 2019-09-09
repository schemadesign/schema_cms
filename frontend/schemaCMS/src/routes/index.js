import React, { Component } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import browserHistory from '../shared/utils/history';
import App from './app.container';
import AuthRoute from './authRoute/authRoute.container';
import JWT from './jwt/jwt.container';
import { NotFound } from './notFound';
import { AUTH_PATH } from '../shared/utils/api.constants';
import { Project } from './project';
import { UserProfile } from './userProfile';
import { ResetPassword } from './resetPassword';
import { Logout } from './logout';

export const ROUTES = {
  HOME: '/',
  NOT_FOUND: '/404',
  USER_PROFILE: '/settings',
  PROJECT: '/project',
  RESET_PASSWORD: '/reset-password',
  LOGOUT: '/logout',
};

export default class RootContainer extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/not-found" component={NotFound} anonymous />

        <App>
          <Switch>
            <AuthRoute exact path={ROUTES.HOME} render={() => <Redirect to={ROUTES.PROJECT} />} />

            <AuthRoute path={ROUTES.PROJECT} component={Project} />

            <AuthRoute path={ROUTES.USER_PROFILE} component={UserProfile} />

            <AuthRoute path={ROUTES.RESET_PASSWORD} component={ResetPassword} />

            <AuthRoute path={ROUTES.LOGOUT} component={Logout} />

            <Route exact path="/login" render={() => browserHistory.push(AUTH_PATH)} />

            <Route exact path="/auth/confirm/" component={JWT} />

            <Route
              exact
              path="/auth/confirm/:user/:token/"
              render={({ match }) => {
                const location = {
                  pathname: '/auth/confirm/',
                  state: {
                    user: match.params.user,
                    token: match.params.token,
                  },
                };

                return <Redirect to={location} />;
              }}
            />
          </Switch>
        </App>
      </Switch>
    );
  }
}
