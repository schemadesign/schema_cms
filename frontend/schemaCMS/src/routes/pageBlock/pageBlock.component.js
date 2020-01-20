import React, { PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { path } from 'ramda';

import { Container, Form, LinkWrapper } from './pageBlock.styles';
import messages from './pageBlock.messages';
import { ContextHeader } from '../../shared/components/contextHeader';
import { BackButton, NavigationContainer, NextButton } from '../../shared/components/navigation';
import { PageBlockForm } from '../../shared/components/pageBlockForm';
import { LoadingWrapper } from '../../shared/components/loadingWrapper';
import { Modal, ModalActions, modalStyles, ModalTitle } from '../../shared/components/modal/modal.styles';
import { Link } from '../../theme/typography';
import { filterMenuOptions, getMatchParam } from '../../shared/utils/helpers';
import reportError from '../../shared/utils/reportError';
import { PAGE_MENU_OPTIONS } from './pageBlock.constants';
import { MobileMenu } from '../../shared/components/menu/mobileMenu';

export class PageBlock extends PureComponent {
  static propTypes = {
    userRole: PropTypes.string.isRequired,
    history: PropTypes.object.isRequired,
    block: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    fetchPageBlock: PropTypes.func.isRequired,
    removePageBlock: PropTypes.func.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
    intl: PropTypes.object.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        blockId: PropTypes.string.isRequired,
      }),
    }),
  };

  state = {
    loading: true,
    error: null,
  };

  async componentDidMount() {
    try {
      const blockId = getMatchParam(this.props, 'blockId');
      await this.props.fetchPageBlock({ blockId });
    } catch (error) {
      reportError(error);
      this.setState({ error });
    } finally {
      this.setState({ loading: false });
    }
  }

  handleRemoveClick = () => this.setState({ confirmationModalOpen: true });

  handleCancelRemove = () => this.setState({ confirmationModalOpen: false });

  handleConfirmRemove = () => {
    const pageId = path(['block', 'page', 'id'], this.props);
    const blockId = getMatchParam(this.props, 'blockId');

    this.props.removePageBlock({ pageId, blockId });
  };

  handleBackClick = () =>
    this.props.history.push(`/page/${path(['block', 'page', 'id'], this.props)}`, { fromBlock: true });

  render() {
    const { handleSubmit, isSubmitting, userRole, ...restProps } = this.props;
    const { loading, error, confirmationModalOpen } = this.state;
    const headerTitle = <FormattedMessage {...messages.title} />;
    const headerSubtitle = <FormattedMessage {...messages.subTitle} />;

    return (
      <Container>
        <MobileMenu
          headerTitle={headerTitle}
          headerSubtitle={headerSubtitle}
          options={filterMenuOptions(PAGE_MENU_OPTIONS, userRole)}
        />
        <ContextHeader title={headerTitle} subtitle={headerSubtitle} />
        <Form onSubmit={handleSubmit}>
          <LoadingWrapper loading={loading} error={error}>
            <PageBlockForm {...this.props} />
            <LinkWrapper>
              <Link id="removePageBlockDesktopBtn" onClick={this.handleRemoveClick}>
                <FormattedMessage {...messages.removePageBlock} />
              </Link>
            </LinkWrapper>
          </LoadingWrapper>
          <NavigationContainer fixed>
            <BackButton id="backBtn" type="button" onClick={this.handleBackClick}>
              <FormattedMessage {...messages.back} />
            </BackButton>
            <NextButton
              id="editPageBlockBtn"
              loading={isSubmitting}
              type="submit"
              disabled={!restProps.isValid || isSubmitting}
            >
              <FormattedMessage {...messages.save} />
            </NextButton>
          </NavigationContainer>
        </Form>
        <Modal isOpen={confirmationModalOpen} contentLabel="Confirm Removal" style={modalStyles}>
          <ModalTitle>
            <FormattedMessage {...messages.removeTitle} />
          </ModalTitle>
          <ModalActions>
            <BackButton onClick={this.handleCancelRemove}>
              <FormattedMessage {...messages.cancelRemoval} />
            </BackButton>
            <NextButton id="confirmRemovalBtn" onClick={this.handleConfirmRemove}>
              <FormattedMessage {...messages.confirmRemoval} />
            </NextButton>
          </ModalActions>
        </Modal>
      </Container>
    );
  }
}
