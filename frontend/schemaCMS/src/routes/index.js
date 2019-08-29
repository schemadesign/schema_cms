import React, { Component } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import browserHistory from '../shared/utils/history';
import App from './app.container';
import AuthRoute from './authRoute/authRoute.container';
import JWT from './jwt/jwt.container';
import { Home } from './home';
import { NotFound } from './notFound';
import { AUTH_PATH } from '../shared/utils/api.constants';
import { Project } from './project';
import { DataSource } from './project/dataSource';

export const ROUTES = {
  HOME: '/',
  NOT_FOUND: '/404',
  PROJECTS: '/projects',
  DATASOURCE: '/datasource',
};

export default class RootContainer extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/not-found" component={NotFound} anonymous />

        <App>
          <Switch>
            <AuthRoute exact path={ROUTES.HOME} component={Home} />

            <AuthRoute path={ROUTES.PROJECTS} component={Project} />
            <AuthRoute path={`${ROUTES.PROJECTS}/:id${ROUTES.DATASOURCE}`} component={DataSource} />

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
