import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { ContextHeader } from '../../../shared/components/contextHeader';
import { UserList } from '../../../shared/components/userList';
import { BackButton, NavigationContainer, PlusButton } from '../../../shared/components/navigation';
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

  handleCancelClick = () => browserHistory.push('/');

  render() {
    const { users } = this.props;
    const headerConfig = {
      headerTitle: <FormattedMessage {...messages.headerTitle} />,
      headerSubtitle: <FormattedMessage {...messages.headerSubtitle} />,
    };

    return (
      <Container>
        <TopHeader {...headerConfig} />
        <ContextHeader title={headerConfig.headerTitle} subtitle={headerConfig.headerSubtitle}>
          <PlusButton id="addUserBtn" onClick={this.handleAddUser} />
        </ContextHeader>
        <UserList users={users} />
        <NavigationContainer hideOnDesktop>
          <BackButton onClick={this.handleCancelClick}>
            <FormattedMessage {...messages.cancel} />
          </BackButton>
          <PlusButton id="addUserBtn" onClick={this.handleAddUser} />
        </NavigationContainer>
      </Container>
    );
  }
}
