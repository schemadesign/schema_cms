import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Modal from 'react-modal';
import { path } from 'ramda';

import { UserList as UserListComponent } from '../../../shared/components/userList';
import { BackButton, NavigationContainer, PlusButton } from '../../../shared/components/navigation';
import { ModalActions, ModalButton, modalStyles, ModalTitle } from '../../../shared/components/modal/modal.styles';
import { TopHeader } from '../../../shared/components/topHeader';
import messages from './userList.messages';
import browserHistory from '../../../shared/utils/history';

export class UserList extends PureComponent {
  static propTypes = {
    clearProject: PropTypes.func.isRequired,
    fetchProject: PropTypes.func.isRequired,
    removeUser: PropTypes.func.isRequired,
    users: PropTypes.array.isRequired,
    match: PropTypes.shape({
      params: PropTypes.object.isRequired,
    }).isRequired,
  };

  state = {
    userToBeRemoved: null,
    showConfirmationModal: false,
  };

  async componentDidMount() {
    try {
      const { match } = this.props;
      this.props.clearProject();

      const projectId = path(['params', 'projectId'], match);

      if (projectId) {
        await this.props.fetchProject({ projectId });
      }
    } catch (e) {
      browserHistory.push('/');
    }
  }

  handleAddUser = () => {
    const projectId = path(['match', 'params', 'projectId'], this.props);
    return browserHistory.push(`/project/${projectId}/user/add`);
  };

  handleBackClick = () => browserHistory.push(`/project/${this.props.match.params.projectId}`);

  handleRemoveUser = ({ id: userId }) => () =>
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

  render() {
    const { showConfirmationModal } = this.state;
    const { users, match } = this.props;
    const topHeaderConfig = {
      headerTitle: <FormattedMessage {...messages.headerTitle} />,
      headerSubtitle: <FormattedMessage {...messages.headerSubtitle} />,
    };
    const projectId = path(['params', 'projectId'], match);

    return (
      <Fragment>
        <TopHeader {...topHeaderConfig} />
        <UserListComponent users={users} projectId={projectId} onRemoveUser={this.handleRemoveUser} />
        <NavigationContainer>
          <BackButton onClick={this.handleBackClick}>
            <FormattedMessage {...messages.back} />
          </BackButton>
          <PlusButton id="addUserBtn" onClick={this.handleAddUser} />
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
      </Fragment>
    );
  }
}
