import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { always } from 'ramda';

import { UserList as UserListComponent } from '../../../shared/components/userList';
import { BackButton, NavigationContainer, PlusButton } from '../../../shared/components/navigation';
import { TopHeader } from '../../../shared/components/topHeader';
import { ProjectTabs } from '../../../shared/components/projectTabs';
import { USERS } from '../../../shared/components/projectTabs/projectTabs.constants';
import { ContextHeader } from '../../../shared/components/contextHeader';
import messages from './userList.messages';
import browserHistory from '../../../shared/utils/history';
import { renderWhenTrue } from '../../../shared/utils/rendering';
import { LoadingWrapper } from '../../../shared/components/loadingWrapper';
import { getProjectId } from '../../../shared/utils/helpers';

export class UserList extends PureComponent {
  static propTypes = {
    fetchUsers: PropTypes.func.isRequired,
    removeUser: PropTypes.func.isRequired,
    users: PropTypes.array.isRequired,
    isAdmin: PropTypes.bool.isRequired,
    match: PropTypes.shape({
      params: PropTypes.object.isRequired,
    }).isRequired,
  };

  state = {
    loading: true,
  };

  async componentDidMount() {
    try {
      const projectId = getProjectId(this.props);

      await this.props.fetchUsers({ projectId });
      this.setState({ loading: false });
    } catch (e) {
      browserHistory.push('/');
    }
  }

  handleAddUser = () => {
    const projectId = getProjectId(this.props);
    return browserHistory.push(`/project/${projectId}/user/add`);
  };

  handleBackClick = () => browserHistory.push(`/project/${this.props.match.params.projectId}`);

  renderCreateUserButton = ({ id, isAdmin }) =>
    renderWhenTrue(always(<PlusButton id={id} onClick={this.handleAddUser} />))(isAdmin);

  render() {
    const { loading } = this.state;
    const { match, isAdmin, users } = this.props;
    const topHeaderConfig = {
      headerTitle: <FormattedMessage {...messages.headerTitle} />,
      headerSubtitle: <FormattedMessage {...messages.headerSubtitle} />,
    };

    return (
      <Fragment>
        <TopHeader {...topHeaderConfig} />
        <ProjectTabs active={USERS} url={`/project/${match.params.projectId}`} />
        <ContextHeader title={topHeaderConfig.headerTitle} subtitle={topHeaderConfig.headerSubtitle}>
          {this.renderCreateUserButton({ id: 'addUserDesktopBtn', isAdmin })}
        </ContextHeader>
        <LoadingWrapper loading={loading} noData={!users.length}>
          <UserListComponent users={this.props.users} projectId={getProjectId(this.props)} />
        </LoadingWrapper>
        <NavigationContainer hideOnDesktop>
          <BackButton onClick={this.handleBackClick}>
            <FormattedMessage {...messages.back} />
          </BackButton>
          {this.renderCreateUserButton({ id: 'addUserBtn', isAdmin })}
        </NavigationContainer>
      </Fragment>
    );
  }
}
