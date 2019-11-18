import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { path } from 'ramda';

import { Container } from './view.styles';
import { renderWhenTrue } from '../../../shared/utils/rendering';
import { UserProfile } from '../../../shared/components/userProfile/userProfile.component';
import { TopHeader } from '../../../shared/components/topHeader';
import { ContextHeader } from '../../../shared/components/contextHeader';
import messages from './view.messages';

export class View extends PureComponent {
  static propTypes = {
    fetchUser: PropTypes.func.isRequired,
    removeUser: PropTypes.func.isRequired,
    removeUserFromProject: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    userData: PropTypes.object.isRequired,
    isAdmin: PropTypes.bool.isRequired,
    history: PropTypes.object.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        userId: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  };

  componentDidMount() {
    this.props.fetchUser({ userId: path(['match', 'params', 'userId'], this.props) });
  }

  renderContent = userData => renderWhenTrue(() => <UserProfile {...this.props} userData={userData} />)(!!userData.id);

  render() {
    const { userData } = this.props;
    const headerTitle = <FormattedMessage {...messages.title} />;
    const headerSubtitle = <FormattedMessage {...messages.subTitle} />;

    return (
      <Container>
        <TopHeader headerTitle={headerTitle} headerSubtitle={headerSubtitle} />
        <ContextHeader title={headerTitle} subtitle={headerSubtitle} />
        {this.renderContent(userData)}
      </Container>
    );
  }
}
