import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { ContextHeader } from '../../../shared/components/contextHeader';
import { UserList } from '../../../shared/components/userList';
import { NavigationContainer, PlusLink, BackLink, LARGE_BUTTON_SIZE } from '../../../shared/components/navigation';
import { LoadingWrapper } from '../../../shared/components/loadingWrapper';
import { Container } from '../../project/list/list.styles';
import messages from './list.messages';
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

  render() {
    const { loading, error } = this.state;
    const { users, userRole } = this.props;

    const headerTitle = <FormattedMessage {...messages.headerTitle} />;
    const headerSubtitle = <FormattedMessage {...messages.headerSubtitle} />;
    const addUserUrl = '/user/add';

    return (
      <Container>
        <MobileMenu
          headerTitle={headerTitle}
          headerSubtitle={headerSubtitle}
          options={filterMenuOptions(USER_MENU_OPTIONS, userRole)}
          active={USER_ID}
        />
        <ContextHeader title={headerTitle} subtitle={headerSubtitle}>
          <PlusLink id="addUserBtn" to={addUserUrl} size={LARGE_BUTTON_SIZE} />
        </ContextHeader>
        <LoadingWrapper loading={loading} error={error} noData={!users.length}>
          <UserList users={users} />
        </LoadingWrapper>
        <NavigationContainer fixed>
          <BackLink to={'/'}>
            <FormattedMessage {...messages.back} />
          </BackLink>
          <PlusLink hideOnDesktop id="addUserBtn" to={addUserUrl} size={LARGE_BUTTON_SIZE} />
        </NavigationContainer>
      </Container>
    );
  }
}
