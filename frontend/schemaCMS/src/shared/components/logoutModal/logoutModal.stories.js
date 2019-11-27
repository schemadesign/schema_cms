import React, { PureComponent, Fragment } from 'react';
import { storiesOf } from '@storybook/react';
import { Button } from 'schemaUI';

import { withTheme } from '../../../.storybook/decorators';
import { LogoutModal } from './logoutModal.component';

export class LogoutModalWrapper extends PureComponent {
  state = {
    logoutModalOpen: false,
  };

  handleLogout = () => {
    this.setState({
      logoutModalOpen: true,
    });
  };

  handleCancelLogout = () => {
    this.setState({
      logoutModalOpen: false,
    });
  };

  handleConfirmLogout = () => {
    console.log('LOGGED OUT'); //eslint-disable-line
    this.handleCancelLogout();
  };

  render() {
    const { logoutModalOpen } = this.state;

    return (
      <Fragment>
        <Button inverse onClick={this.handleLogout} customStyles={{ margin: 40, padding: '0 20px' }}>
          Show <b>LogoutModal</b>
        </Button>
        <LogoutModal
          logoutModalOpen={logoutModalOpen}
          onConfirm={this.handleConfirmLogout}
          onCancel={this.handleCancelLogout}
        />
      </Fragment>
    );
  }
}

storiesOf('Shared Components|LogoutModal', module)
  .addDecorator(withTheme())
  .add('Default', () => <LogoutModalWrapper />);
