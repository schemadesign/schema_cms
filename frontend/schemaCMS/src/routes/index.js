import React, { Component } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import browserHistory from '../shared/utils/history';
import { OKTA_URL, AUTH0_URL } from '../shared/utils/api.constants';
import App from './app.container';
import AuthRoute from './authRoute/authRoute.container';
import JWT from './jwt/jwt.container';
import { DataSource } from './dataSource';
import { DataWranglingScript } from './dataWranglingScript';
import { Filter } from './filter';
import { JobDetail } from './jobDetail';
import { Logout } from './logout';
import { NotAuthorized } from './notAuthorized';
import { NotFound } from './notFound';
import { NotRegistered } from './notRegistered';
import { RevokedAccess } from './revokedAccess';
import { Preview as JobPreview } from './jobDetail/preview';
import { Project } from './project';
import { List as ProjectList } from './project/list';
import { Create as ProjectCreate } from './project/create';
import { ResetPassword } from './resetPassword';
import { Settings } from './settings';
import { User } from './user';
import { TagCategory } from './tagCategory';
import { DataSourceState } from './dataSourceState';
import { BlockTemplate } from './blockTemplate';
import { PageTemplate } from './pageTemplate';
import { Section } from './section';
import { Page } from './page';

export const ROUTES = {
  HOME: '/',
  NOT_FOUND: '/404',
  AUTH: '/auth',
  NOT_AUTHORIZED: '/not-authorized',
  PROJECT: '/project',
  PROJECT_CREATE: '/project/create',
  RESET_PASSWORD: '/reset-password',
  LOGOUT: '/logout',
  DATA_SOURCE: '/datasource',
  FOLDER: '/folder',
  BLOCK: '/block',
  DATA_WRANGLING_SCRIPTS: '/script',
  SETTINGS: '/settings',
  USER: '/user',
  FILTER: '/filter',
  JOB_DETAIL: '/job',
  TAG_CATEGORY: '/tag-category',
  STATE: '/state',
  BLOCK_TEMPLATE: '/block-template',
  PAGE_TEMPLATE: '/page-template',
  SECTION: '/section',
  PAGE: '/page',
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

            <AuthRoute exact path={ROUTES.PROJECT} component={ProjectList} />

            <AuthRoute exact path={ROUTES.PROJECT_CREATE} component={ProjectCreate} />

            <AuthRoute path={`${ROUTES.PROJECT}/:projectId`} component={Project} />

            <AuthRoute path={`${ROUTES.DATA_SOURCE}/:dataSourceId`} component={DataSource} />

            <AuthRoute path={`${ROUTES.BLOCK_TEMPLATE}/:blockTemplateId`} component={BlockTemplate} />

            <AuthRoute path={`${ROUTES.PAGE_TEMPLATE}/:pageTemplateId`} component={PageTemplate} />

            <AuthRoute path={`${ROUTES.SECTION}/:sectionId`} component={Section} />

            <AuthRoute path={`${ROUTES.PAGE}/:pageId`} component={Page} />

            <AuthRoute
              exact
              path={`${ROUTES.DATA_WRANGLING_SCRIPTS}/:scriptId/:dataSourceId?`}
              component={DataWranglingScript}
            />

            <AuthRoute path={ROUTES.RESET_PASSWORD} component={ResetPassword} />

            <AuthRoute path={ROUTES.SETTINGS} component={Settings} />

            <AuthRoute path={ROUTES.USER} component={User} />

            <AuthRoute exact path={`${ROUTES.FILTER}/:filterId`} component={Filter} />

            <AuthRoute exact path={`${ROUTES.TAG_CATEGORY}/:tagCategoryId`} component={TagCategory} />

            <AuthRoute path={`${ROUTES.STATE}`} component={DataSourceState} />

            <AuthRoute exact path={`${ROUTES.JOB_DETAIL}/:jobId`} component={JobDetail} />

            <AuthRoute exact path={`${ROUTES.JOB_DETAIL}/:jobId/preview`} component={JobPreview} />

            <Route path={ROUTES.LOGOUT} component={Logout} />

            <AuthRoute exact path="/login" />

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
