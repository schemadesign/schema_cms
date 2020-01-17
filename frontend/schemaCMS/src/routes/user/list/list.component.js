import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { ContextHeader } from '../../../shared/components/contextHeader';
import { UserList } from '../../../shared/components/userList';
import { BackButton, NavigationContainer, PlusButton } from '../../../shared/components/navigation';
import { LoadingWrapper } from '../../../shared/components/loadingWrapper';
import { Container } from '../../project/list/list.styles';
import messages from './list.messages';
import browserHistory from '../../../shared/utils/history';
import { USER_ID, USER_MENU_OPTIONS } from '../user.constants';
import { MobileMenu } from '../../../shared/components/menu/mobileMenu';
import reportError from '../../../shared/utils/reportError';
import { filterMenuOptions } from '../../../shared/utils/helpers';

export class List extends PureComponent {
  static propTypes = {
    userRole: PropTypes.string.isRequired,
    fetchUsers: PropTypes.func.isRequired,
    users: PropTypes.array.isRequired,
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
    const { users, userRole } = this.props;

    const headerTitle = <FormattedMessage {...messages.headerTitle} />;
    const headerSubtitle = <FormattedMessage {...messages.headerSubtitle} />;

    return (
      <Container>
        <MobileMenu
          headerTitle={headerTitle}
          headerSubtitle={headerSubtitle}
          options={filterMenuOptions(USER_MENU_OPTIONS, userRole)}
          active={USER_ID}
        />
        <ContextHeader title={headerTitle} subtitle={headerSubtitle}>
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
