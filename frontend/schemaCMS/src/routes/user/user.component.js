import React, { PureComponent } from 'react';
import { Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import { UserCreateCMS, UserCreateProject } from '../../shared/components/userCreate';
import List from './list/list.container';
import View from './view/view.container';

export class User extends PureComponent {
  static propTypes = {
    createUserProject: PropTypes.func.isRequired,
    createUserCMS: PropTypes.func.isRequired,
    match: PropTypes.shape({
      path: PropTypes.string.isRequired,
    }).isRequired,
  };

  render() {
    const {
      match: { path },
    } = this.props;

    const withUserId = `${path}/:userId`;
    const withProjectId = `${withUserId}/add/:projectId`;
    const add = `${path}/add`;

    return (
      <Switch>
        <Route exact path={withUserId} component={View} />
        <Route exact path={path} component={List} />
        <Route exact path={withProjectId} render={({ match }) => <UserCreateProject {...this.props} match={match} />} />
        <Route exact path={add} render={() => <UserCreateCMS {...this.props} />} />
      </Switch>
    );
  }
}
