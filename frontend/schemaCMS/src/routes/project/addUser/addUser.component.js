import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { always, find, ifElse, propEq } from 'ramda';
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
import { Modal, ModalActions, modalStyles, ModalTitle } from '../../../shared/components/modal/modal.styles';
import { BackButton, NavigationContainer, NextButton } from '../../../shared/components/navigation';
import { LoadingWrapper } from '../../../shared/components/loadingWrapper';
import { getMatchParam } from '../../../shared/utils/helpers';
import { MobileMenu } from '../../../shared/components/menu/mobileMenu';
import { getMenuProjects, NONE } from '../project.constants';
import { ContextHeader } from '../../../shared/components/contextHeader';

export class AddUser extends PureComponent {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        projectId: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }),
    fetchUsers: PropTypes.func.isRequired,
    removeUser: PropTypes.func.isRequired,
    fetchProjectEditors: PropTypes.func.isRequired,
    users: PropTypes.array.isRequired,
    usersInProject: PropTypes.array.isRequired,
    isAdmin: PropTypes.bool.isRequired,
  };

  state = {
    userToBeRemoved: null,
    showConfirmationModal: false,
    loading: true,
    error: null,
  };

  async componentDidMount() {
    try {
      const projectId = getMatchParam(this.props, 'projectId');
      if (!this.props.isAdmin) {
        return this.props.history.push('/not-authorized');
      }

      await this.props.fetchUsers({ projectId });
      await this.props.fetchProjectEditors({ projectId });
    } catch (error) {
      this.setState({ error });
    } finally {
      return this.setState({ loading: false });
    }
  }

  handleAddUser = userId => this.props.history.push(`/user/${userId}/add/${getMatchParam(this.props, 'projectId')}`);

  handleRemoveUser = userId =>
    this.setState({
      userToBeRemoved: userId,
      showConfirmationModal: true,
    });

  handleCancelRemove = () =>
    this.setState({
      userToBeRemoved: null,
      showConfirmationModal: false,
    });

  handleConfirmRemove = async () => {
    const { userToBeRemoved } = this.state;
    const projectId = getMatchParam(this.props, 'projectId');

    this.setState({
      loading: true,
      userToBeRemoved: null,
      showConfirmationModal: false,
    });

    try {
      await this.props.removeUser({ projectId, userId: userToBeRemoved });
      await this.props.fetchProjectEditors({ projectId });
    } catch (error) {
      this.setState({ error });
    } finally {
      return this.setState({ loading: false });
    }
  };

  handleBackClick = () => this.props.history.push(`/project/${getMatchParam(this.props, 'projectId')}/user`);

  renderAction = ({ id }, index) => {
    const { usersInProject } = this.props;

    return ifElse(
      find(propEq('id', id)),
      always(
        <Button
          id={`removeUserPlusButton${index}`}
          onClick={() => this.handleRemoveUser(id)}
          customStyles={buttonStyles}
        >
          <Icons.MinusIcon customStyles={iconStyles} />
        </Button>
      ),
      always(
        <Button id={`addUserPlusButton${index}`} onClick={() => this.handleAddUser(id)} customStyles={buttonStyles}>
          <Icons.PlusIcon customStyles={iconStyles} />
        </Button>
      )
    )(usersInProject);
  };

  renderUser = (user, index) => (
    <UserItem key={index}>
      <UserItemDescription>
        <UserFullName>{`${user.firstName} ${user.lastName}`}</UserFullName>
        <Email>{user.email}</Email>
      </UserItemDescription>
      <Action>{this.renderAction(user, index)}</Action>
    </UserItem>
  );

  render() {
    const { users } = this.props;
    const { showConfirmationModal, loading, error } = this.state;
    const projectId = getMatchParam(this.props, 'projectId');
    const headerTitle = <FormattedMessage {...messages.headerTitle} />;
    const headerSubtitle = <FormattedMessage {...messages.headerSubtitle} />;

    return (
      <Container>
        <ContextHeader title={headerTitle} subtitle={headerSubtitle} />
        <MobileMenu
          headerTitle={headerTitle}
          headerSubtitle={headerSubtitle}
          options={getMenuProjects(projectId, NONE)}
        />
        <LoadingWrapper loading={loading} error={error} noData={!users.length}>
          {this.props.users.map(this.renderUser)}
        </LoadingWrapper>
        <NavigationContainer fixed>
          <BackButton onClick={this.handleBackClick}>
            <FormattedMessage {...messages.back} />
          </BackButton>
        </NavigationContainer>
        <Modal isOpen={showConfirmationModal} contentLabel="Confirm Removal" style={modalStyles}>
          <ModalTitle>
            <FormattedMessage {...messages.removeTitle} />
          </ModalTitle>
          <ModalActions>
            <BackButton onClick={this.handleCancelRemove}>
              <FormattedMessage {...messages.cancelRemoval} />
            </BackButton>
            <NextButton onClick={this.handleConfirmRemove}>
              <FormattedMessage {...messages.confirmRemoval} />
            </NextButton>
          </ModalActions>
        </Modal>
      </Container>
    );
  }
}
