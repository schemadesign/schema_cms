import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { always, equals, ifElse, path } from 'ramda';

import { Container } from './view.styles';
import { renderWhenTrue } from '../../../shared/utils/rendering';
import { UserProfile } from '../../../shared/components/userProfile/userProfile.component';
import { TopHeader } from '../../../shared/components/topHeader';
import { ContextHeader } from '../../../shared/components/contextHeader';
import messages from './view.messages';
import { ME } from '../../../modules/userProfile/userProfile.constants';

export class View extends PureComponent {
  static propTypes = {
    fetchUser: PropTypes.func.isRequired,
    removeUser: PropTypes.func.isRequired,
    removeUserFromProject: PropTypes.func.isRequired,
    updateMe: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired,
    isAdmin: PropTypes.bool.isRequired,
    history: PropTypes.object.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        userId: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  };

  state = {
    isCurrentUser: path(['match', 'params', 'userId'], this.props) === ME,
  };

  componentDidMount() {
    if (!this.state.isCurrentUser) {
      this.props.fetchUser({ userId: path(['match', 'params', 'userId'], this.props) });
    }
  }

  getTitles = ifElse(
    equals(true),
    always({
      title: <FormattedMessage {...messages.currentUserTitle} />,
      subtitle: <FormattedMessage {...messages.currentUserSubTitle} />,
    }),
    always({
      title: <FormattedMessage {...messages.title} />,
      subtitle: <FormattedMessage {...messages.subTitle} />,
    })
  );

  getHeaderAndMenuConfig = (headerTitle, headerSubtitle) => {
    const secondaryMenuItems = this.props.isAdmin ? [] : [];

    return {
      headerTitle,
      headerSubtitle,
      secondaryMenuItems,
    };
  };

  renderContent = userData =>
    renderWhenTrue(() => <UserProfile {...this.props} userData={userData} isCurrentUser={this.state.isCurrentUser} />)(
      !!userData.id
    );

  render() {
    const { user, currentUser } = this.props;
    const { isCurrentUser } = this.state;
    const userData = isCurrentUser ? currentUser : user;
    const { title, subtitle } = this.getTitles(isCurrentUser);

    const topHeaderConfig = this.getHeaderAndMenuConfig(title, subtitle);

    return (
      <Container>
        <TopHeader {...topHeaderConfig} />
        <ContextHeader title={title} subtitle={subtitle} />
        {this.renderContent(userData)}
      </Container>
    );
  }
}
