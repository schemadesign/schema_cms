import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Modal from 'react-modal';
import { path } from 'ramda';

import { Container } from './view.styles';
import { renderWhenTrue } from '../../../shared/utils/rendering';
import { UserProfile } from '../../../shared/components/userProfile/userProfile.component';
import { TopHeader } from '../../../shared/components/topHeader';
import { ContextHeader } from '../../../shared/components/contextHeader';
import messages from './view.messages';
import { ModalActions, ModalButton, getModalStyles, ModalTitle } from '../../../shared/components/modal/modal.styles';

export class View extends PureComponent {
  static propTypes = {
    fetchUser: PropTypes.func.isRequired,
    removeUser: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    userData: PropTypes.object.isRequired,
    isAdmin: PropTypes.bool.isRequired,
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
    this.props.fetchUser({ userId: path(['match', 'params', 'userId'], this.props) });
  }

  getHeaderAndMenuConfig = (headerTitle, headerSubtitle) => {
    const userRemoveButton = {
      label: <FormattedMessage {...messages.removeUser} />,
      onClick: () => this.setState({ userRemoveModalOpen: true }),
    };
    const secondaryMenuItems = this.props.isAdmin ? [userRemoveButton] : [];

    return {
      headerTitle,
      headerSubtitle,
      secondaryMenuItems,
    };
  };

  handleCancelRemove = () => this.setState({ userRemoveModalOpen: false });

  handleConfirmRemove = () => {
    const userId = path(['userData', 'id'], this.props);
    this.props.removeUser({ userId });
  };

  renderContent = renderWhenTrue(() => <UserProfile {...this.props} />);

  render() {
    const title = <FormattedMessage {...messages.title} />;
    const subtitle = <FormattedMessage {...messages.subTitle} />;

    const topHeaderConfig = this.getHeaderAndMenuConfig(title, subtitle);

    return (
      <Container>
        <TopHeader {...topHeaderConfig} />
        <ContextHeader title={title} subtitle={subtitle} />
        {this.renderContent(!!this.props.userData.id)}
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
