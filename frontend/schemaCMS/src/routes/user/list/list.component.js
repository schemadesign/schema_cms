import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { UserList } from '../../../shared/components/userList';
import { NavigationContainer, PlusButton } from '../../../shared/components/navigation';
import { Container } from '../../project/list/list.styles';
import { TopHeader } from '../../../shared/components/topHeader';
import messages from './list.messages';
import browserHistory from '../../../shared/utils/history';

export class List extends PureComponent {
  static propTypes = {
    fetchUsers: PropTypes.func.isRequired,
    users: PropTypes.array.isRequired,
  };

  componentDidMount() {
    this.props.fetchUsers();
  }

  handleAddUser = () => browserHistory.push('/user/add');

  render() {
    const { users } = this.props;
    const topHeaderConfig = {
      headerTitle: <FormattedMessage {...messages.headerTitle} />,
      headerSubtitle: <FormattedMessage {...messages.headerSubtitle} />,
    };

    return (
      <Container>
        <TopHeader {...topHeaderConfig} />
        <UserList users={users} />
        <NavigationContainer right>
          <PlusButton id="addUserBtn" onClick={this.handleAddUser} />
        </NavigationContainer>
      </Container>
    );
  }
}
