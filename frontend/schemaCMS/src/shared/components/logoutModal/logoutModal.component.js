import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { modalStyles, Modal, ModalTitle, ModalActions } from '../modal/modal.styles';
import { BackButton, NextButton } from '../navigation';
import messages from './logoutModal.messages';

export class LogoutModal extends PureComponent {
  static propTypes = {
    logoutModalOpen: PropTypes.bool.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
  };

  render() {
    const { logoutModalOpen, onConfirm: handleConfirm, onCancel: handleCancel } = this.props;

    return (
      <Modal isOpen={logoutModalOpen} contentLabel="Confirm Logout" style={modalStyles}>
        <ModalTitle>
          <FormattedMessage {...messages.title} />
        </ModalTitle>
        <ModalActions>
          <BackButton onClick={handleCancel}>
            <FormattedMessage {...messages.cancel} />
          </BackButton>
          <NextButton onClick={handleConfirm}>
            <FormattedMessage {...messages.confirm} />
          </NextButton>
        </ModalActions>
      </Modal>
    );
  }
}
