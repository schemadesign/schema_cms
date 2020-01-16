import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { ContextHeader } from '../../../shared/components/contextHeader';
import { UserList } from '../../../shared/components/userList';
import { BackButton, NavigationContainer, PlusButton } from '../../../shared/components/navigation';
import { LoadingWrapper } from '../../../shared/components/loadingWrapper';
import { Container } from '../../project/list/list.styles';
import { TopHeader } from '../../../shared/components/topHeader';
import messages from './list.messages';
import browserHistory from '../../../shared/utils/history';
import reportError from '../../../shared/utils/reportError';

export class List extends PureComponent {
  static propTypes = {
    fetchUsers: PropTypes.func.isRequired,
    users: PropTypes.array.isRequired,
    isAdmin: PropTypes.bool.isRequired,
  };

  state = {
    loading: true,
    error: null,
  };

  async componentDidMount() {
    try {
      await this.props.fetchUsers();
      this.setState({ loading: false });
    } catch (error) {
      reportError(error);
      this.setState({ loading: false, error });
    }
  }

  handleAddUser = () => browserHistory.push('/user/add');

  handleCancelClick = () => browserHistory.push('/');

  render() {
    const { loading, error } = this.state;
    const { users, isAdmin } = this.props;

    const headerConfig = {
      headerTitle: <FormattedMessage {...messages.headerTitle} />,
      headerSubtitle: <FormattedMessage {...messages.headerSubtitle} />,
      isAdmin,
    };

    return (
      <Container>
        <TopHeader {...headerConfig} />
        <ContextHeader title={headerConfig.headerTitle} subtitle={headerConfig.headerSubtitle}>
          <PlusButton id="addUserBtn" onClick={this.handleAddUser} />
        </ContextHeader>
        <LoadingWrapper loading={loading} error={error} noData={!users.length}>
          <UserList users={users} />
        </LoadingWrapper>
        <NavigationContainer fixed hideOnDesktop>
          <BackButton onClick={this.handleCancelClick}>
            <FormattedMessage {...messages.cancel} />
          </BackButton>
          <PlusButton id="addUserBtn" onClick={this.handleAddUser} />
        </NavigationContainer>
      </Container>
    );
  }
}
