import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { always, find, ifElse, path, propEq } from 'ramda';
import { FormattedMessage } from 'react-intl';

import {
  Action,
  AddIcon,
  Button,
  Container,
  Email,
  RemoveIcon,
  UserFullName,
  UserItem,
  UserItemDescription,
} from './addUser.styles';
import { TopHeader } from '../../../shared/components/topHeader';
import messages from './addUser.messages';
import { ModalActions, modalStyles, Modal, ModalTitle } from '../../../shared/components/modal/modal.styles';
import { BackButton, NavigationContainer, NextButton } from '../../../shared/components/navigation';
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
    fetchProject: PropTypes.func.isRequired,
    users: PropTypes.array.isRequired,
    usersInProject: PropTypes.array.isRequired,
    isAdmin: PropTypes.bool.isRequired,
  };

  state = {
    userToBeRemoved: null,
    showConfirmationModal: false,
  };

  async componentDidMount() {
    try {
      const projectId = path(['match', 'params', 'projectId'], this.props);
      if (!this.props.isAdmin) {
        return this.props.history.push('/not-authorized');
      }

      await this.props.fetchProject({ projectId });
      await this.props.fetchUsers();
    } catch (e) {
      this.props.history.push('/');
    }
  }

  getHeaderConfig = () => ({
    headerTitle: <FormattedMessage {...messages.headerTitle} />,
    headerSubtitle: <FormattedMessage {...messages.headerSubtitle} />,
  });

  handleAddUser = userId =>
    this.props.history.push(`/user/${userId}/add/${path(['match', 'params', 'projectId'], this.props)}`);

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

  handleConfirmRemove = () => {
    const { userToBeRemoved } = this.state;
    const projectId = path(['match', 'params', 'projectId'], this.props);

    this.props.removeUser({ projectId, userId: userToBeRemoved });
    this.setState({
      userToBeRemoved: null,
      showConfirmationModal: false,
    });
  };

  handleBackClick = () => this.props.history.push(`/project/${this.props.match.params.projectId}/user`);

  renderAction = ({ id }, index) => {
    const { usersInProject } = this.props;

    return ifElse(
      find(propEq('id', id)),
      always(
        <Button id={`removeUserPlusButton${index}`} onClick={() => this.handleRemoveUser(id)}>
          <RemoveIcon />
        </Button>
      ),
      always(
        <Button id={`addUserPlusButton${index}`} onClick={() => this.handleAddUser(id)}>
          <AddIcon />
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
    const { showConfirmationModal } = this.state;
    const headerConfig = this.getHeaderConfig();

    return (
      <Container>
        <TopHeader {...headerConfig} />
        <ContextHeader title={headerConfig.headerTitle} subtitle={headerConfig.headerSubtitle} />
        {users.map(this.renderUser)}
        <NavigationContainer>
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
