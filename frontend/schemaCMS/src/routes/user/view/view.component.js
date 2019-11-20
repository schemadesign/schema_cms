import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { path } from 'ramda';

import { Container } from './view.styles';
import { renderWhenTrue } from '../../../shared/utils/rendering';
import { UserProfile } from '../../../shared/components/userProfile/userProfile.component';
import { TopHeader } from '../../../shared/components/topHeader';
import { ContextHeader } from '../../../shared/components/contextHeader';
import messages from './view.messages';
import { modalStyles, Modal, ModalActions, ModalTitle } from '../../../shared/components/modal/modal.styles';
import { Link, LinkContainer } from '../../../theme/typography';
import { ROLES } from '../../../modules/userProfile/userProfile.constants';
import { BackButton, NavigationContainer, NextButton } from '../../../shared/components/navigation';

export class View extends PureComponent {
  static propTypes = {
    fetchUser: PropTypes.func.isRequired,
    removeUser: PropTypes.func.isRequired,
    makeAdmin: PropTypes.func.isRequired,
    userData: PropTypes.object.isRequired,
    isAdmin: PropTypes.bool.isRequired,
    history: PropTypes.object.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        userId: PropTypes.string.isRequired,
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

  handleCancelRemove = () => this.setState({ userRemoveModalOpen: false });

  handleConfirmRemove = () => {
    const userId = this.getUserId();

    return this.props.removeUser({ userId });
  };

  handleMakeAdmin = () => this.props.makeAdmin({ userId: this.getUserId() });

  handleBack = () => this.props.history.push('/user');

  renderContent = userData => renderWhenTrue(() => <UserProfile values={userData} />)(!!userData.id);

  renderMakeAdmin = renderWhenTrue(() => (
    <Link onClick={this.handleMakeAdmin}>
      <FormattedMessage {...messages.makeAdmin} />
    </Link>
  ));

  render() {
    const { userData, isAdmin } = this.props;
    const isEditor = userData.role === ROLES.EDITOR;
    const headerTitle = <FormattedMessage {...messages.title} />;
    const headerSubtitle = <FormattedMessage {...messages.subTitle} />;

    return (
      <Container>
        <TopHeader headerTitle={headerTitle} headerSubtitle={headerSubtitle} />
        <ContextHeader title={headerTitle} subtitle={headerSubtitle} />
        {this.renderContent(userData)}
        <LinkContainer>
          <Link onClick={() => this.setState({ userRemoveModalOpen: true })}>
            <FormattedMessage {...messages.removeUser} />
          </Link>
          {this.renderMakeAdmin(isEditor && isAdmin)}
        </LinkContainer>
        <NavigationContainer>
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
