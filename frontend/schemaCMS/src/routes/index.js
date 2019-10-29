import React, { Component } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import browserHistory from '../shared/utils/history';
import App from './app.container';
import AuthRoute from './authRoute/authRoute.container';
import JWT from './jwt/jwt.container';
import { NotFound } from './notFound';
import { AUTH_PATH } from '../shared/utils/api.constants';
import { Project } from './project';
import { Settings } from './settings';
import { ResetPassword } from './resetPassword';
import { Logout } from './logout';
import { DataSource } from './dataSource';
import { DataWranglingScript } from './dataWranglingScript';
import { User } from './user';
import { JobDetail } from './jobDetail';
import { Preview as JobPreview } from './jobDetail/preview';

export const ROUTES = {
  HOME: '/',
  NOT_FOUND: '/404',
  SETTINGS: '/settings',
  PROJECT: '/project',
  RESET_PASSWORD: '/reset-password',
  LOGOUT: '/logout',
  DATA_SOURCE: '/datasource',
  DATA_WRANGLING_SCRIPTS: '/script',
  USER: '/user',
  JOB_DETAIL: '/job',
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

            <AuthRoute path={ROUTES.DATA_SOURCE} component={DataSource} />

            <AuthRoute exact path={`${ROUTES.DATA_WRANGLING_SCRIPTS}/:scriptId`} component={DataWranglingScript} />

            <AuthRoute path={ROUTES.SETTINGS} component={Settings} />

            <AuthRoute path={ROUTES.RESET_PASSWORD} component={ResetPassword} />

            <AuthRoute path={ROUTES.USER} component={User} />

            <AuthRoute exact path={`${ROUTES.JOB_DETAIL}/:jobId`} component={JobDetail} />

            <AuthRoute exact path={`${ROUTES.JOB_DETAIL}/:jobId/preview`} component={JobPreview} />

            <Route path={ROUTES.LOGOUT} component={Logout} />

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
            <Route path="*" component={NotFound} />
          </Switch>
        </App>
      </Switch>
    );
  }
}
