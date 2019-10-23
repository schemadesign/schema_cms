import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { path, ifElse, always, propEq, find } from 'ramda';
import { FormattedMessage } from 'react-intl';
import Modal from 'react-modal';

import browserHistory from '../../../shared/utils/history';
import { Container, AddIcon, RemoveIcon, UserItem, Button, UserItemDescription, Action, Email, UserFullName } from './addUser.styles';
import { TopHeader } from '../../../shared/components/topHeader';
import messages from './addUser.messages';
import { ModalActions, ModalButton, modalStyles, ModalTitle } from '../../../shared/components/modal/modal.styles';
import { BackButton, NavigationContainer } from '../../../shared/components/navigation';

export class AddUser extends PureComponent {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        projectId: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    fetchUsers: PropTypes.func.isRequired,
    removeUser: PropTypes.func.isRequired,
    fetchProject: PropTypes.func.isRequired,
    users: PropTypes.array.isRequired,
    usersInProject: PropTypes.array.isRequired,
  };

  state = {
    userToBeRemoved: null,
    showConfirmationModal: false,
  };

  async componentDidMount() {
    try {
      await this.props.fetchProject(path(['match', 'params'], this.props));
      await this.props.fetchUsers();
    } catch (e) {
      browserHistory.push('/');
    }
  }

  getHeaderConfig = () => ({
    headerTitle: <FormattedMessage {...messages.headerTitle} />,
    headerSubtitle: <FormattedMessage {...messages.headerSubtitle} />,
  });

  handleAddUser = userId =>
    browserHistory.push(`/user/${userId}/add/${path(['match', 'params', 'projectId'], this.props)}`);

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

  handleBackClick = () => browserHistory.push(`/project/${this.props.match.params.projectId}/user`);

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
      <Action>
        {this.renderAction(user, index)}
      </Action>
    </UserItem>
  );

  render() {
    const { users } = this.props;
    const { showConfirmationModal } = this.state;

    return (
      <Container>
        <TopHeader {...this.getHeaderConfig()} />
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
            <ModalButton onClick={this.handleCancelRemove}>
              <FormattedMessage {...messages.cancelRemoval} />
            </ModalButton>
            <ModalButton onClick={this.handleConfirmRemove}>
              <FormattedMessage {...messages.confirmRemoval} />
            </ModalButton>
          </ModalActions>
        </Modal>
      </Container>
    );
  }
}
