import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Container } from './view.styles';
import { renderWhenTrue } from '../../../shared/utils/rendering';
import { UserProfile } from '../../../shared/components/userProfile/userProfile.component';
import { TopHeader } from '../../../shared/components/topHeader';
import messages from './view.messages';

export class View extends PureComponent {
  static propTypes = {
    fetchUser: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    userData: PropTypes.object.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        userId: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  };

  componentDidMount() {
    this.props.fetchUser({ userId: this.props.match.params.userId });
  }

  getHeaderAndMenuConfig = intl => ({
    headerTitle: intl.formatMessage(messages.title),
    headerSubtitle: intl.formatMessage(messages.subTitle),
  });

  renderContent = renderWhenTrue(() => <UserProfile {...this.props} />);

  render() {
    const topHeaderConfig = this.getHeaderAndMenuConfig(this.props.intl);

    return (
      <Container>
        <TopHeader {...topHeaderConfig} />
        {this.renderContent(!!this.props.userData.id)}
      </Container>
    );
  }
}
