import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { path } from 'ramda';

import { Form } from './edit.styles';
import { LoadingWrapper } from '../../../shared/components/loadingWrapper';
import { TopHeader } from '../../../shared/components/topHeader';
import { ContextHeader } from '../../../shared/components/contextHeader';
import messages from './edit.messages';
import { BackButton, NavigationContainer, NextButton } from '../../../shared/components/navigation';
import { PageForm } from '../../../shared/components/pageForm';
import { Modal, ModalActions, modalStyles, ModalTitle } from '../../../shared/components/modal/modal.styles';
import { Link } from '../../../theme/typography';

export class Edit extends PureComponent {
  static propTypes = {
    page: PropTypes.object.isRequired,
    values: PropTypes.object.isRequired,
    fetchPage: PropTypes.func.isRequired,
    handleChange: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    removePage: PropTypes.func.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        pageId: PropTypes.string.isRequired,
      }),
    }),
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }),
    intl: PropTypes.shape({
      formatMessage: PropTypes.func.isRequired,
    }),
    isValid: PropTypes.bool.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
  };

  state = {
    loading: true,
    error: null,
  };

  async componentDidMount() {
    try {
      const { pageId } = this.props.match.params;

      await this.props.fetchPage({ pageId });
      this.setState({ loading: false });
    } catch (error) {
      this.setState({ loading: false, error });
    }
  }

  getFolderId = () => path(['page', 'folder', 'id'], this.props);

  handleRemoveClick = () => this.setState({ confirmationModalOpen: true });

  handleCancelRemove = () => this.setState({ confirmationModalOpen: false });

  handleConfirmRemove = () => {
    const pageId = path(['match', 'params', 'pageId'], this.props);
    const folderId = this.getFolderId();

    this.props.removePage({ pageId, folderId });
  };

  handleBackClick = () => this.props.history.push(`/folder/${this.getFolderId()}`);

  render() {
    const { loading, error, confirmationModalOpen } = this.state;
    const { handleSubmit, isValid, isSubmitting } = this.props;
    const headerTitle = <FormattedMessage {...messages.title} />;
    const headerSubtitle = <FormattedMessage {...messages.subTitle} />;

    return (
      <Fragment>
        <TopHeader headerTitle={headerTitle} headerSubtitle={headerSubtitle} />
        <ContextHeader title={headerTitle} subtitle={headerSubtitle} />
        <LoadingWrapper loading={loading} error={error}>
          <Form onSubmit={handleSubmit}>
            <PageForm {...this.props} />
            <Link id="removePageDesktopBtn" onClick={this.handleRemoveClick}>
              <FormattedMessage {...messages.removePage} />
            </Link>
            <NavigationContainer fixed>
              <BackButton id="backBtn" type="button" onClick={this.handleBackClick}>
                <FormattedMessage {...messages.back} />
              </BackButton>
              <NextButton id="savePageBtn" type="submit" loading={isSubmitting} disabled={!isValid || isSubmitting}>
                <FormattedMessage {...messages.save} />
              </NextButton>
            </NavigationContainer>
          </Form>
        </LoadingWrapper>
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
      </Fragment>
    );
  }
}
