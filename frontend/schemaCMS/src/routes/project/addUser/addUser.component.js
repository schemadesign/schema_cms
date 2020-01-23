import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { differenceWith } from 'ramda';
import { FormattedMessage } from 'react-intl';
import { Icons } from 'schemaUI';

import {
  Action,
  Button,
  buttonStyles,
  Container,
  Email,
  iconStyles,
  UserFullName,
  UserItem,
  UserItemDescription,
} from './addUser.styles';
import messages from './addUser.messages';
import { BackButton, NavigationContainer } from '../../../shared/components/navigation';
import { LoadingWrapper } from '../../../shared/components/loadingWrapper';
import { getMatchParam, filterMenuOptions } from '../../../shared/utils/helpers';
import reportError from '../../../shared/utils/reportError';
import { MobileMenu } from '../../../shared/components/menu/mobileMenu';
import { getProjectMenuOptions } from '../project.constants';
import { ContextHeader } from '../../../shared/components/contextHeader';

export class AddUser extends PureComponent {
  static propTypes = {
    userRole: PropTypes.string,
    match: PropTypes.shape({
      params: PropTypes.shape({
        projectId: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }),
    fetchUsers: PropTypes.func.isRequired,
    fetchProjectEditors: PropTypes.func.isRequired,
    users: PropTypes.array.isRequired,
    usersInProject: PropTypes.array.isRequired,
    isAdmin: PropTypes.bool.isRequired,
  };

  state = {
    loading: true,
    error: null,
  };

  async componentDidMount() {
    try {
      const projectId = getMatchParam(this.props, 'projectId');
      if (!this.props.isAdmin) {
        this.props.history.push('/not-authorized');
      } else {
        await this.props.fetchUsers({ projectId });
        await this.props.fetchProjectEditors({ projectId });
      }
    } catch (error) {
      reportError(error);
      this.setState({ error });
    } finally {
      this.setState({ loading: false });
    }
  }

  handleAddUser = userId => this.props.history.push(`/user/${userId}/add/${getMatchParam(this.props, 'projectId')}`);

  handleBackClick = () => this.props.history.push(`/project/${getMatchParam(this.props, 'projectId')}/user`);

  renderUser = (user, index) => (
    <UserItem key={index}>
      <UserItemDescription>
        <UserFullName>{`${user.firstName} ${user.lastName}`}</UserFullName>
        <Email>{user.email}</Email>
      </UserItemDescription>
      <Action>
        <Button
          id={`addUserPlusButton${index}`}
          onClick={() => this.handleAddUser(user.id)}
          customStyles={buttonStyles}
        >
          <Icons.PlusIcon customStyles={iconStyles} />
        </Button>
      </Action>
    </UserItem>
  );

  render() {
    const { users, userRole, usersInProject } = this.props;
    const { loading, error } = this.state;
    const projectId = getMatchParam(this.props, 'projectId');
    const headerTitle = <FormattedMessage {...messages.headerTitle} />;
    const headerSubtitle = <FormattedMessage {...messages.headerSubtitle} />;
    const noDataMessage = <FormattedMessage {...messages.noData} />;
    const menuOptions = getProjectMenuOptions(projectId);
    const usersToInvite = differenceWith((x, y) => x.id === y.id, users, usersInProject);

    return (
      <Container>
        <ContextHeader title={headerTitle} subtitle={headerSubtitle} />
        <MobileMenu
          headerTitle={headerTitle}
          headerSubtitle={headerSubtitle}
          options={filterMenuOptions(menuOptions, userRole)}
        />
        <LoadingWrapper loading={loading} error={error} noData={!usersToInvite.length} noDataContent={noDataMessage}>
          {usersToInvite.map(this.renderUser)}
        </LoadingWrapper>
        <NavigationContainer fixed>
          <BackButton onClick={this.handleBackClick}>
            <FormattedMessage {...messages.back} />
          </BackButton>
        </NavigationContainer>
      </Container>
    );
  }
}
