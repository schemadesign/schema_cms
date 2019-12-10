import React, { PureComponent, Fragment } from 'react';
import { storiesOf } from '@storybook/react';
import { Button } from 'schemaUI';

import { withTheme } from '../../../.storybook/decorators';
import { LogoutModal } from './logoutModal.component';

export class LogoutModalWrapper extends PureComponent {
  state = {
    logoutModalOpen: false,
  };

  handleShowModal = () => {
    this.setState({
      logoutModalOpen: true,
    });
  };

  handleHideModal = () => {
    this.setState({
      logoutModalOpen: false,
    });
  };

  render() {
    const { logoutModalOpen } = this.state;

    return (
      <Fragment>
        <Button inverse onClick={this.handleShowModal} customStyles={{ margin: 40, padding: '0 20px' }}>
          Show <b>LogoutModal</b>
        </Button>
        <LogoutModal logoutModalOpen={logoutModalOpen} onAction={this.handleHideModal} redirectUrl="redirectUrl" />
      </Fragment>
    );
  }
}

storiesOf('Shared Components|LogoutModal', module)
  .addDecorator(withTheme())
  .add('Default', () => <LogoutModalWrapper />);
