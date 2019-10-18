import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import UserProfile from '../../shared/components/userProfile';
import { Container } from './settings.styles';
import { TopHeader } from '../../shared/components/topHeader';
import messages from './settings.messages';

export class Settings extends PureComponent {
  static propTypes = {
    intl: PropTypes.object.isRequired,
    userData: PropTypes.object.isRequired,
    updateMe: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
  };

  getHeaderAndMenuConfig = intl => ({
    headerTitle: intl.formatMessage(messages.title),
    headerSubtitle: intl.formatMessage(messages.subTitle),
    secondaryMenuItems: [
      {
        label: intl.formatMessage(messages.resetPassword),
        to: '/reset-password',
      },
      {
        label: intl.formatMessage(messages.logout),
        to: '/logout',
      },
    ],
  });

  render() {
    const topHeaderConfig = this.getHeaderAndMenuConfig(this.props.intl);

    return (
      <Container>
        <TopHeader {...topHeaderConfig} />
        <UserProfile {...this.props} isSettings />
      </Container>
    );
  }
}
