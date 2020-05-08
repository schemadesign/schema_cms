import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { always, pathOr } from 'ramda';
import { FormattedMessage } from 'react-intl';

import { Container, Form } from './projectTag.styles';
import messages from './projectTag.messages';
import { LoadingWrapper } from '../../shared/components/loadingWrapper';
import { ContextHeader } from '../../shared/components/contextHeader';
import { getMatchParam } from '../../shared/utils/helpers';
import { MobileMenu } from '../../shared/components/menu/mobileMenu';
import reportError from '../../shared/utils/reportError';
import { ProjectTagForm } from '../../shared/components/projectTagForm';
import { Modal, ModalActions, modalStyles, ModalTitle } from '../../shared/components/modal/modal.styles';
import { BackButton, NavigationContainer, NextButton } from '../../shared/components/navigation';
import { TAG_CATEGORIES_PAGE } from '../../modules/project/project.constants';
import { renderWhenTrue } from '../../shared/utils/rendering';
import { Link } from '../../theme/typography';

export class ProjectTag extends PureComponent {
  static propTypes = {
    userRole: PropTypes.string.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
    dirty: PropTypes.bool.isRequired,
    isValid: PropTypes.bool.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    fetchTag: PropTypes.func.isRequired,
    removeTag: PropTypes.func.isRequired,
    tag: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        tagId: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    intl: PropTypes.object.isRequired,
  };

  state = {
    error: null,
    loading: true,
    confirmationModalOpen: false,
    removeLoading: false,
  };

  async componentDidMount() {
    try {
      const tagId = getMatchParam(this.props, 'tagId');
      await this.props.fetchTag({ tagId });

      this.setState({ loading: false });
    } catch (error) {
      reportError(error);
      this.setState({ loading: false, error });
    }
  }

  getHeaderAndMenuConfig = () => ({
    headerTitle: pathOr('', ['tag', 'project', 'name'], this.props),
    headerSubtitle: <FormattedMessage {...messages.subTitle} />,
  });

  handleBack = () =>
    this.props.history.push(`/project/${pathOr('', ['tag', 'project', 'id'], this.props)}/${TAG_CATEGORIES_PAGE}`);

  handleRemoveList = () => this.setState({ confirmationModalOpen: true });

  handleCancelRemove = () => this.setState({ confirmationModalOpen: false });

  handleConfirmRemove = async () => {
    try {
      this.setState({ removeLoading: true });

      const { project, id: tagId } = this.props.tag;
      await this.props.removeTag({ projectId: project.id, tagId });
    } catch (error) {
      this.setState({ removeLoading: false });
      reportError(error);
    }
  };

  renderRemoveTagLink = renderWhenTrue(
    always(
      <Link onClick={this.handleRemoveList}>
        <FormattedMessage {...messages.deleteList} />
      </Link>
    )
  );

  render() {
    const { error, loading, removeLoading, confirmationModalOpen } = this.state;
    const { tag, isValid, isSubmitting, dirty, handleSubmit } = this.props;
    const headerConfig = this.getHeaderAndMenuConfig();

    return (
      <Container>
        <MobileMenu {...headerConfig} />
        <ContextHeader title={headerConfig.headerTitle} subtitle={headerConfig.headerSubtitle} />
        <LoadingWrapper loading={loading} error={error}>
          <Form onSubmit={handleSubmit}>
            <ProjectTagForm {...this.props} />
            {this.renderRemoveTagLink(!!tag.id)}
            <NavigationContainer fixed>
              <BackButton onClick={this.handleBack} type="button">
                <FormattedMessage {...messages.back} />
              </BackButton>
              <NextButton loading={isSubmitting} disabled={!dirty || !isValid || isSubmitting} type="submit">
                <FormattedMessage {...messages.saveTag} />
              </NextButton>
            </NavigationContainer>
          </Form>
        </LoadingWrapper>
        <Modal isOpen={confirmationModalOpen} contentLabel="Confirm Removal" style={modalStyles}>
          <ModalTitle>
            <FormattedMessage {...messages.removeTitle} />
          </ModalTitle>
          <ModalActions>
            <BackButton onClick={this.handleCancelRemove} disabled={removeLoading}>
              <FormattedMessage {...messages.cancelRemoval} />
            </BackButton>
            <NextButton
              id="confirmRemovalBtn"
              onClick={this.handleConfirmRemove}
              loading={removeLoading}
              disabled={removeLoading}
            >
              <FormattedMessage {...messages.confirmRemoval} />
            </NextButton>
          </ModalActions>
        </Modal>
      </Container>
    );
  }
}
