import React, { Component } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import browserHistory from '../shared/utils/history';
import { AUTH_PATH } from '../shared/utils/api.constants';
import App from './app.container';
import AuthRoute from './authRoute/authRoute.container';
import JWT from './jwt/jwt.container';
import { DataSource } from './dataSource';
import { DataWranglingScript } from './dataWranglingScript';
import { Filter } from './filter';
import { Folder } from './folder';
import { JobDetail } from './jobDetail';
import { Logout } from './logout';
import { NotAuthorized } from './notAuthorized';
import { NotFound } from './notFound';
import { NotRegistered } from './notRegistered';
import { RevokedAccess } from './revokedAccess';
import { Page } from './page';
import { PageBlock } from './pageBlock';
import { Preview as JobPreview } from './jobDetail/preview';
import { Project } from './project';
import { ResetPassword } from './resetPassword';
import { Settings } from './settings';
import { User } from './user';
import { DataSourceTag } from './dataSourceTag';
import { ProjectState } from './projectState';

export const ROUTES = {
  HOME: '/',
  NOT_FOUND: '/404',
  AUTH: '/auth',
  NOT_AUTHORIZED: '/not-authorized',
  PROJECT: '/project',
  RESET_PASSWORD: '/reset-password',
  LOGOUT: '/logout',
  DATA_SOURCE: '/datasource',
  FOLDER: '/folder',
  PAGE: '/page',
  BLOCK: '/block',
  DATA_WRANGLING_SCRIPTS: '/script',
  SETTINGS: '/settings',
  USER: '/user',
  FILTER: '/filter',
  JOB_DETAIL: '/job',
  TAG: '/tag',
  STATE: '/state',
};

export default class RootContainer extends Component {
  render() {
    return (
      <Switch>
        <App>
          <Switch>
            <AuthRoute exact path={ROUTES.NOT_FOUND} component={NotFound} anonymous />

            <AuthRoute exact path={ROUTES.NOT_AUTHORIZED} component={NotAuthorized} />

            <AuthRoute exact path={ROUTES.HOME} render={() => <Redirect to={ROUTES.PROJECT} />} />

            <AuthRoute path={ROUTES.PROJECT} component={Project} />

            <AuthRoute path={`${ROUTES.DATA_SOURCE}/:dataSourceId`} component={DataSource} />

            <AuthRoute path={ROUTES.FOLDER} component={Folder} />

            <AuthRoute path={ROUTES.PAGE} component={Page} />

            <AuthRoute exact path={`${ROUTES.BLOCK}/:blockId`} component={PageBlock} />

            <AuthRoute
              exact
              path={`${ROUTES.DATA_WRANGLING_SCRIPTS}/:scriptId/:dataSourceId?`}
              component={DataWranglingScript}
            />

            <AuthRoute path={ROUTES.RESET_PASSWORD} component={ResetPassword} />

            <AuthRoute path={ROUTES.SETTINGS} component={Settings} />

            <AuthRoute path={ROUTES.USER} component={User} />

            <AuthRoute exact path={`${ROUTES.FILTER}/:filterId`} component={Filter} />

            <AuthRoute exact path={`${ROUTES.TAG}/:tagId`} component={DataSourceTag} />

            <AuthRoute path={`${ROUTES.STATE}/:stateId`} component={ProjectState} />

            <AuthRoute exact path={`${ROUTES.JOB_DETAIL}/:jobId`} component={JobDetail} />

            <AuthRoute exact path={`${ROUTES.JOB_DETAIL}/:jobId/preview`} component={JobPreview} />

            <Route path={ROUTES.LOGOUT} component={Logout} />

            <Route exact path="/login" render={() => browserHistory.push(AUTH_PATH)} />

            <Route exact path={`${ROUTES.AUTH}/confirm`} component={JWT} />

            <Route exact path={`${ROUTES.AUTH}/not-registered`} component={NotRegistered} />

            <Route exact path={`${ROUTES.AUTH}/revoked-access`} component={RevokedAccess} />

            <Route
              exact
              path={`${ROUTES.AUTH}/confirm/:user/:token/`}
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
            <AuthRoute path="*" component={NotFound} />
          </Switch>
        </App>
      </Switch>
    );
  }
}
