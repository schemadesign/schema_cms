import React, { PureComponent } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { UserCreateProject, UserCreateCMS } from '../../shared/components/userCreate';

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

    const withProjectId = `${path}/:userId/add/:projectId`;
    const add = `${path}/add`;

    return (
      <Switch>
        <Redirect exact path={path} to={add} />
        <Route exact path={withProjectId} render={({ match }) => <UserCreateProject {...this.props} match={match} />} />
        <Route exact path={add} render={() => <UserCreateCMS {...this.props} />} />
      </Switch>
    );
  }
}
