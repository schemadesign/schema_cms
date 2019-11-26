import React, { PureComponent } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import { UserCreateCMS, UserCreateProject } from '../../shared/components/userCreate';
import List from './list/list.container';
import View from './view/view.container';

export class User extends PureComponent {
  static propTypes = {
    createUserProject: PropTypes.func.isRequired,
    createUserCMS: PropTypes.func.isRequired,
    isAdmin: PropTypes.bool.isRequired,
    match: PropTypes.shape({
      path: PropTypes.string.isRequired,
    }).isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    intl: PropTypes.object.isRequired,
  };

  componentDidMount() {
    if (!this.props.isAdmin) {
      this.props.history.push('/not-authorized');
    }
  }

  render() {
    const {
      match: { path },
    } = this.props;

    const withUserId = `${path}/:userId`;
    const withProjectId = `${withUserId}/add/:projectId`;
    const add = `${path}/add`;
    const mePath = `${path}/me`;

    return (
      <Switch>
        <Route exact path={path} component={List} />
        <Route exact path={withProjectId} render={({ match }) => <UserCreateProject {...this.props} match={match} />} />
        <Route exact path={add} render={() => <UserCreateCMS {...this.props} />} />
        <Redirect exact path={mePath} to="/settings" />
        <Route exact path={withUserId} component={View} />
      </Switch>
    );
  }
}
