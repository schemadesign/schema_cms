import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { always } from 'ramda';

import { Container } from './userDetails.styles';
import { renderWhenTrue } from '../../../shared/utils/rendering';
import { UserProfile } from '../../../shared/components/userProfile/userProfile.component';
import messages from './userDetails.messages';
import { Modal, modalStyles, ModalActions, ModalTitle } from '../../../shared/components/modal/modal.styles';
import { Link, LinkContainer } from '../../../theme/typography';
import { BackButton, NavigationContainer, NextButton } from '../../../shared/components/navigation';
import { getMatchParam } from '../../../shared/utils/helpers';
import reportError from '../../../shared/utils/reportError';
import { MobileMenu } from '../../../shared/components/menu/mobileMenu';
import { getMenuProjects, NONE } from '../project.constants';
import { ContextHeader } from '../../../shared/components/contextHeader';
import { LoadingWrapper } from '../../../shared/components/loadingWrapper';

export class UserDetails extends PureComponent {
  static propTypes = {
    fetchUser: PropTypes.func.isRequired,
    removeEditorFromProject: PropTypes.func.isRequired,
    userData: PropTypes.object.isRequired,
    isAdmin: PropTypes.bool.isRequired,
    history: PropTypes.object.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        userId: PropTypes.string.isRequired,
        projectId: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  };

  state = {
    error: null,
    loading: true,
    userRemoveModalOpen: false,
  };

  async componentDidMount() {
    try {
      const userId = getMatchParam(this.props, 'userId');
      await this.props.fetchUser({ userId });
      this.setState({ loading: false });
    } catch (error) {
      reportError(error);
      this.setState({ loading: false, error });
    }
  }

  handleCancelRemove = () => this.setState({ userRemoveModalOpen: false });

  handleConfirmRemove = () => {
    const userId = getMatchParam(this.props, 'userId');
    const projectId = getMatchParam(this.props, 'projectId');

    this.props.removeEditorFromProject({ projectId, userId, isDetails: true });
  };

  handleBack = () => this.props.history.push(`/project/${getMatchParam(this.props, 'projectId')}/user`);

  renderContent = userData => renderWhenTrue(() => <UserProfile values={userData} />)(!!userData.id);

  renderRemoveUserButton = renderWhenTrue(
    always(
      <LinkContainer>
        <Link onClick={() => this.setState({ userRemoveModalOpen: true })}>
          <FormattedMessage {...messages.removeEditorFromProject} />
        </Link>
      </LinkContainer>
    )
  );

  render() {
    const { error, loading } = this.state;
    const { userData, isAdmin } = this.props;
    const headerTitle = <FormattedMessage {...messages.title} />;
    const headerSubtitle = <FormattedMessage {...messages.subTitle} />;
    const projectId = getMatchParam(this.props, 'projectId');

    return (
      <Container>
        <ContextHeader title={headerTitle} subtitle={headerSubtitle} />
        <MobileMenu
          headerTitle={headerTitle}
          headerSubtitle={headerSubtitle}
          options={getMenuProjects(projectId, NONE)}
        />
        <LoadingWrapper loading={loading} error={error}>
          {this.renderContent(userData)}
          {this.renderRemoveUserButton(isAdmin)}
        </LoadingWrapper>
        <NavigationContainer fixed>
          <BackButton type="button" onClick={this.handleBack} />
        </NavigationContainer>
        <Modal isOpen={this.state.userRemoveModalOpen} contentLabel="Confirm Removal" style={modalStyles}>
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
