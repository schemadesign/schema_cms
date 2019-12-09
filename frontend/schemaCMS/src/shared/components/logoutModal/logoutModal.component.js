import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { modalStyles, Modal, ModalTitle, ModalActions } from '../modal/modal.styles';
import { BackButton, ConfirmLink } from '../navigation';
import messages from './logoutModal.messages';

export class LogoutModal extends PureComponent {
  static propTypes = {
    logoutModalOpen: PropTypes.bool.isRequired,
    redirectUrl: PropTypes.string.isRequired,
    onAction: PropTypes.func.isRequired,
  };

  render() {
    const { logoutModalOpen, onAction: handleAction, redirectUrl } = this.props;

    return (
      <Modal isOpen={logoutModalOpen} contentLabel="Confirm Logout" style={modalStyles}>
        <ModalTitle>
          <FormattedMessage {...messages.title} />
        </ModalTitle>
        <ModalActions>
          <BackButton onClick={handleAction}>
            <FormattedMessage {...messages.cancel} />
          </BackButton>
          <ConfirmLink to={redirectUrl} onClick={handleAction}>
            <FormattedMessage {...messages.confirm} />
          </ConfirmLink>
        </ModalActions>
      </Modal>
    );
  }
}
