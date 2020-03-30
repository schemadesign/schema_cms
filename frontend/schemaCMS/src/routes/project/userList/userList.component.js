import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { always } from 'ramda';

import { UserList as UserListComponent } from '../../../shared/components/userList';
import { BackArrowButton, NavigationContainer, PlusButton } from '../../../shared/components/navigation';
import { ProjectTabs } from '../../../shared/components/projectTabs';
import { USERS } from '../../../shared/components/projectTabs/projectTabs.constants';
import { ContextHeader } from '../../../shared/components/contextHeader';
import messages from './userList.messages';
import browserHistory from '../../../shared/utils/history';
import { renderWhenTrue } from '../../../shared/utils/rendering';
import { LoadingWrapper } from '../../../shared/components/loadingWrapper';
import { filterMenuOptions, getMatchParam } from '../../../shared/utils/helpers';
import reportError from '../../../shared/utils/reportError';
import { MobileMenu } from '../../../shared/components/menu/mobileMenu';
import { getProjectMenuOptions, PROJECT_USERS_ID } from '../project.constants';

export class UserList extends PureComponent {
  static propTypes = {
    userRole: PropTypes.string,
    fetchUsers: PropTypes.func.isRequired,
    removeUser: PropTypes.func.isRequired,
    users: PropTypes.array.isRequired,
    isAdmin: PropTypes.bool.isRequired,
    match: PropTypes.shape({
      params: PropTypes.object.isRequired,
    }).isRequired,
  };

  state = {
    error: null,
    loading: true,
  };

  async componentDidMount() {
    try {
      const projectId = getMatchParam(this.props, 'projectId');

      await this.props.fetchUsers({ projectId });
      this.setState({ loading: false });
    } catch (error) {
      reportError(error);
      this.setState({ loading: false, error });
    }
  }

  handleAddUser = () => {
    const projectId = getMatchParam(this.props, 'projectId');
    return browserHistory.push(`/project/${projectId}/user/add`);
  };

  handleBackClick = () => browserHistory.push(`/project/${getMatchParam(this.props, 'projectId')}`);

  renderCreateUserButton = ({ id, isAdmin }) =>
    renderWhenTrue(always(<PlusButton id={id} onClick={this.handleAddUser} />))(isAdmin);

  render() {
    const { error, loading } = this.state;
    const { match, isAdmin, users, userRole } = this.props;
    const headerTitle = <FormattedMessage {...messages.headerTitle} />;
    const headerSubtitle = <FormattedMessage {...messages.headerSubtitle} />;
    const projectId = getMatchParam(this.props, 'projectId');
    const menuOptions = getProjectMenuOptions(projectId);

    return (
      <Fragment>
        <MobileMenu
          headerTitle={headerTitle}
          headerSubtitle={headerSubtitle}
          options={filterMenuOptions(menuOptions, userRole)}
          active={PROJECT_USERS_ID}
        />
        <ProjectTabs active={USERS} url={`/project/${match.params.projectId}`} />
        <ContextHeader title={headerTitle} subtitle={headerSubtitle}>
          {this.renderCreateUserButton({ id: 'addUserDesktopBtn', isAdmin })}
        </ContextHeader>
        <LoadingWrapper
          loading={loading}
          noData={!users.length}
          noDataContent={<FormattedMessage {...messages.noUsers} />}
          error={error}
        >
          <UserListComponent users={this.props.users} projectId={getMatchParam(this.props, 'projectId')} />
        </LoadingWrapper>
        <NavigationContainer fixed hideOnDesktop>
          <BackArrowButton onClick={this.handleBackClick}>
            <FormattedMessage {...messages.back} />
          </BackArrowButton>
          {this.renderCreateUserButton({ id: 'addUserBtn', isAdmin })}
        </NavigationContainer>
      </Fragment>
    );
  }
}
