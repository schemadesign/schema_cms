import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'ramda';
import { FormattedMessage } from 'react-intl';

import { modalStyles, Modal, ModalTitle, ModalActions } from '../modal/modal.styles';
import { BackButton, NextButton } from '../navigation';
import messages from './logoutModal.messages';

export class LogoutModal extends PureComponent {
  static propTypes = {};

  render() {
    return (
      <Modal isOpen={confirmationModalOpen} contentLabel="Confirm Logout" style={modalStyles}>
        <ModalTitle>
          <FormattedMessage {...messages.title} />
        </ModalTitle>
        <ModalActions>
          <BackButton onClick={this.handleCancel}>
            <FormattedMessage {...messages.cancel} />
          </BackButton>
          <NextButton onClick={this.handleConfirm}>
            <FormattedMessage {...messages.confirm} />
          </NextButton>
        </ModalActions>
      </Modal>
    );
  }
}
