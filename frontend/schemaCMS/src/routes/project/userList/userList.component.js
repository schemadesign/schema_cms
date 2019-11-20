import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { always, path } from 'ramda';

import { UserList as UserListComponent } from '../../../shared/components/userList';
import { BackButton, NavigationContainer, NextButton, PlusButton } from '../../../shared/components/navigation';
import { ModalActions, Modal, modalStyles, ModalTitle } from '../../../shared/components/modal/modal.styles';
import { TopHeader } from '../../../shared/components/topHeader';
import { ProjectTabs } from '../../../shared/components/projectTabs';
import { USERS } from '../../../shared/components/projectTabs/projectTabs.constants';
import { ContextHeader } from '../../../shared/components/contextHeader';
import messages from './userList.messages';
import browserHistory from '../../../shared/utils/history';
import { renderWhenTrue } from '../../../shared/utils/rendering';

export class UserList extends PureComponent {
  static propTypes = {
    clearProject: PropTypes.func.isRequired,
    fetchProject: PropTypes.func.isRequired,
    removeUser: PropTypes.func.isRequired,
    users: PropTypes.array.isRequired,
    isAdmin: PropTypes.bool.isRequired,
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

  renderCreateUserButton = ({ id, isAdmin }) =>
    renderWhenTrue(always(<PlusButton id={id} onClick={this.handleAddUser} />))(isAdmin);

  render() {
    const { showConfirmationModal } = this.state;
    const { users, match, isAdmin } = this.props;
    const topHeaderConfig = {
      headerTitle: <FormattedMessage {...messages.headerTitle} />,
      headerSubtitle: <FormattedMessage {...messages.headerSubtitle} />,
    };
    const projectId = path(['params', 'projectId'], match);

    return (
      <Fragment>
        <TopHeader {...topHeaderConfig} />
        <ProjectTabs active={USERS} url={`/project/${match.params.projectId}`} />
        <ContextHeader title={topHeaderConfig.headerTitle} subtitle={topHeaderConfig.headerSubtitle}>
          {this.renderCreateUserButton({ id: 'addUserDesktopBtn', isAdmin })}
        </ContextHeader>
        <UserListComponent users={users} projectId={projectId} onRemoveUser={this.handleRemoveUser} isAdmin={isAdmin} />
        <NavigationContainer hideOnDesktop>
          <BackButton onClick={this.handleBackClick}>
            <FormattedMessage {...messages.back} />
          </BackButton>
          {this.renderCreateUserButton({ id: 'addUserBtn', isAdmin })}
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
      </Fragment>
    );
  }
}
