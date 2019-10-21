import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

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

  getHeaderAndMenuConfig = () => ({
    headerTitle: <FormattedMessage {...messages.title} />,
    headerSubtitle: <FormattedMessage {...messages.subTitle} />,
    secondaryMenuItems: [
      {
        label: <FormattedMessage {...messages.resetPassword} />,
        to: '/reset-password',
      },
      {
        label: <FormattedMessage {...messages.logout} />,
        to: '/logout',
      },
    ],
  });

  render() {
    const topHeaderConfig = this.getHeaderAndMenuConfig();

    return (
      <Container>
        <TopHeader {...topHeaderConfig} />
        <UserProfile {...this.props} isSettings />
      </Container>
    );
  }
}
