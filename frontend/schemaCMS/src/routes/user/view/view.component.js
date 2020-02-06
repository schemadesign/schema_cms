import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Container, Link } from './view.styles';
import { renderWhenTrue } from '../../../shared/utils/rendering';
import { UserProfile } from '../../../shared/components/userProfile/userProfile.component';
import { ContextHeader } from '../../../shared/components/contextHeader';
import messages from './view.messages';
import { Modal, ModalActions, modalStyles, ModalTitle } from '../../../shared/components/modal/modal.styles';
import { LinkContainer } from '../../../theme/typography';
import { ROLES } from '../../../modules/userProfile/userProfile.constants';
import { BackButton, NavigationContainer, NextButton } from '../../../shared/components/navigation';
import { LoadingWrapper } from '../../../shared/components/loadingWrapper';
import { filterMenuOptions, getMatchParam } from '../../../shared/utils/helpers';
import { MobileMenu } from '../../../shared/components/menu/mobileMenu';
import { USER_MENU_OPTIONS } from '../user.constants';
import reportError from '../../../shared/utils/reportError';

export class View extends PureComponent {
  static propTypes = {
    userRole: PropTypes.string.isRequired,
    fetchUser: PropTypes.func.isRequired,
    removeUser: PropTypes.func.isRequired,
    makeAdmin: PropTypes.func.isRequired,
    userData: PropTypes.object.isRequired,
    isAdmin: PropTypes.bool.isRequired,
    history: PropTypes.object.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        userId: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  };

  state = {
    error: null,
    loading: true,
    removeLoading: false,
    makeAdminLoading: false,
    userRemoveModalOpen: false,
    makeAdminModalOpen: false,
  };

  async componentDidMount() {
    try {
      const userId = getMatchParam(this.props, 'userId');

      await this.props.fetchUser({ userId });
      this.setState({ loading: false });
    } catch (error) {
      reportError(error);
      this.setState({ loading: false, error });
    }
  }

  handleCancelRemove = () => this.setState({ userRemoveModalOpen: false });
  handleCancelMakeAdmin = () => this.setState({ makeAdminModalOpen: false });

  handleConfirmRemove = async () => {
    try {
      this.setState({ removeLoading: true });
      const userId = getMatchParam(this.props, 'userId');

      await this.props.removeUser({ userId });
    } catch (error) {
      this.setState({ removeLoading: false });
      reportError(error);
    }
  };

  handleConfirmMakeAdmin = async () => {
    try {
      this.setState({ makeAdminLoading: true });

      await this.props.makeAdmin({ userId: getMatchParam(this.props, 'userId') });
    } catch (error) {
      reportError(error);
    } finally {
      this.setState({ makeAdminModalOpen: false, makeAdminLoading: false });
    }
  };

  handleBack = () => this.props.history.push('/user');

  renderUserContent = userData => renderWhenTrue(() => <UserProfile values={userData} />)(!!userData.id);

  renderMakeAdmin = renderWhenTrue(() => (
    <Link onClick={() => this.setState({ makeAdminModalOpen: true })}>
      <FormattedMessage {...messages.makeAdmin} />
    </Link>
  ));

  renderContent = (userData, isEditor, isAdmin) => () => (
    <Fragment>
      {this.renderUserContent(userData)}
      <LinkContainer>
        <Link onClick={() => this.setState({ userRemoveModalOpen: true })}>
          <FormattedMessage {...messages.removeUser} />
        </Link>
        {this.renderMakeAdmin(isEditor && isAdmin)}
      </LinkContainer>
    </Fragment>
  );

  render() {
    const { loading, error, removeLoading, makeAdminLoading } = this.state;
    const { userData, isAdmin, userRole } = this.props;
    const isEditor = userData.role === ROLES.EDITOR;
    const headerTitle = <FormattedMessage {...messages.title} />;
    const headerSubtitle = <FormattedMessage {...messages.subTitle} />;

    return (
      <Container>
        <MobileMenu
          headerTitle={headerTitle}
          headerSubtitle={headerSubtitle}
          options={filterMenuOptions(USER_MENU_OPTIONS, userRole)}
        />
        <ContextHeader title={headerTitle} subtitle={headerSubtitle} />
        <LoadingWrapper loading={loading} error={error}>
          {this.renderContent(userData, isEditor, isAdmin)}
        </LoadingWrapper>
        <NavigationContainer fixed>
          <BackButton type="button" onClick={this.handleBack} />
        </NavigationContainer>
        <Modal isOpen={this.state.userRemoveModalOpen} contentLabel="Confirm Removal" style={modalStyles}>
          <ModalTitle>
            <FormattedMessage {...messages.removeTitle} />
          </ModalTitle>
          <ModalActions>
            <BackButton onClick={this.handleCancelRemove} disabled={removeLoading}>
              <FormattedMessage {...messages.cancelRemoval} />
            </BackButton>
            <NextButton onClick={this.handleConfirmRemove} loading={removeLoading} disabled={removeLoading}>
              <FormattedMessage {...messages.confirmRemoval} />
            </NextButton>
          </ModalActions>
        </Modal>
        <Modal isOpen={this.state.makeAdminModalOpen} contentLabel="Confirm Removal" style={modalStyles}>
          <ModalTitle>
            <FormattedMessage {...messages.makeAdminTitle} />
          </ModalTitle>
          <ModalActions>
            <BackButton onClick={this.handleCancelMakeAdmin}>
              <FormattedMessage {...messages.cancelRemoval} disabled={makeAdminLoading} />
            </BackButton>
            <NextButton onClick={this.handleConfirmMakeAdmin} loading={makeAdminLoading} disabled={makeAdminLoading}>
              <FormattedMessage {...messages.confirmRemoval} />
            </NextButton>
          </ModalActions>
        </Modal>
      </Container>
    );
  }
}
