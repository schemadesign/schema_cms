import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { path } from 'ramda';
import Modal from 'react-modal';

import { Container } from './userDetails.styles';
import { renderWhenTrue } from '../../../shared/utils/rendering';
import { UserProfile } from '../../../shared/components/userProfile/userProfile.component';
import messages from './userDetails.messages';
import { TopHeader } from '../../../shared/components/topHeader';
import { ContextHeader } from '../../../shared/components/contextHeader';
import { getModalStyles, ModalActions, ModalButton, ModalTitle } from '../../../shared/components/modal/modal.styles';
import { Link, LinkContainer } from '../../../theme/typography';
import { BackButton, NavigationContainer } from '../../../shared/components/navigation';

export class UserDetails extends PureComponent {
  static propTypes = {
    fetchUser: PropTypes.func.isRequired,
    removeEditorFromProject: PropTypes.func.isRequired,
    userData: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        userId: PropTypes.string.isRequired,
        projectId: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  };

  state = {
    userRemoveModalOpen: false,
  };

  componentDidMount() {
    const userId = this.getUserId();
    this.props.fetchUser({ userId });
  }

  getUserId = () => path(['match', 'params', 'userId'], this.props);
  getProjectId = () => path(['match', 'params', 'projectId'], this.props);

  handleCancelRemove = () => this.setState({ userRemoveModalOpen: false });

  handleConfirmRemove = () => {
    const userId = this.getUserId();
    const projectId = this.getProjectId();

    this.props.removeEditorFromProject({ projectId, userId, isDetails: true });
  };

  handleBack = () => this.props.history.push(`/project/${this.getProjectId()}/user`);

  renderContent = userData => renderWhenTrue(() => <UserProfile values={userData} />)(!!userData.id);

  render() {
    const { userData } = this.props;
    const headerTitle = <FormattedMessage {...messages.title} />;
    const headerSubtitle = <FormattedMessage {...messages.subTitle} />;

    return (
      <Container>
        <TopHeader headerTitle={headerTitle} headerSubtitle={headerSubtitle} />
        <ContextHeader title={headerTitle} subtitle={headerSubtitle} />
        {this.renderContent(userData)}
        <LinkContainer>
          <Link onClick={() => this.setState({ userRemoveModalOpen: true })}>
            <FormattedMessage {...messages.removeEditorFromProject} />
          </Link>
        </LinkContainer>
        <NavigationContainer>
          <BackButton type="button" onClick={this.handleBack} />
        </NavigationContainer>
        <Modal isOpen={this.state.userRemoveModalOpen} contentLabel="Confirm Removal" style={getModalStyles()}>
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
