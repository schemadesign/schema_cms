import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { path } from 'ramda';

import { UserList as UserListComponent } from '../../../shared/components/userList';
import { NavigationContainer, PlusButton } from '../../../shared/components/navigation';
import { TopHeader } from '../../../shared/components/topHeader';
import messages from './userList.messages';
import browserHistory from '../../../shared/utils/history';

export class UserList extends PureComponent {
  static propTypes = {
    clearProject: PropTypes.func.isRequired,
    fetchProject: PropTypes.func.isRequired,
    users: PropTypes.array.isRequired,
    match: PropTypes.shape({
      params: PropTypes.object.isRequired,
    }).isRequired,
  };

  async componentDidMount() {
    try {
      const { match } = this.props;
      this.props.clearProject();

      const projectId = path(['params', 'projectId'], match);

      if (projectId) {
        await this.props.fetchProject({ projectId });
      }
    } catch (e) {
      browserHistory.push('/');
    }
  }

  handleAddUser = () => browserHistory.push(`/project/${prop(['match', 'params', 'projectId'], this.props)}/user`);

  render() {
    const { users } = this.props;
    const topHeaderConfig = {
      headerTitle: <FormattedMessage {...messages.headerTitle} />,
      headerSubtitle: <FormattedMessage {...messages.headerSubtitle} />,
    };

    return (
      <Fragment>
        <TopHeader {...topHeaderConfig} />
        <UserListComponent users={users} />
        <NavigationContainer right>
          <PlusButton id="addUserBtn" onClick={this.handleAddUser} />
        </NavigationContainer>
      </Fragment>
    );
  }
}
