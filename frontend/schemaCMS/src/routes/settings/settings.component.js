import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { UserProfile } from '../../shared/components/userProfile/userProfile.component';
import { TopHeader } from '../../shared/components/topHeader';
import { ContextHeader } from '../../shared/components/contextHeader';
import messages from './settings.messages';

export class Settings extends PureComponent {
  static propTypes = {
    updateMe: PropTypes.func.isRequired,
    userData: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  };

  render() {
    const headerTitle = <FormattedMessage {...messages.title} />;
    const headerSubtitle = <FormattedMessage {...messages.subTitle} />;

    return (
      <Fragment>
        <TopHeader headerTitle={headerTitle} headerSubtitle={headerSubtitle} />
        <ContextHeader title={headerTitle} subtitle={headerSubtitle} />
        <UserProfile {...this.props} isCurrentUser />
      </Fragment>
    );
  }
}
