import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { pathOr } from 'ramda';
import { FormattedMessage } from 'react-intl';

import { Container, Form } from './tagCategory.styles';
import messages from './tagCategory.messages';
import { LoadingWrapper } from '../../shared/components/loadingWrapper';
import { ContextHeader } from '../../shared/components/contextHeader';
import { getMatchParam } from '../../shared/utils/helpers';
import { MobileMenu } from '../../shared/components/menu/mobileMenu';
import reportError from '../../shared/utils/reportError';
import { TagCategoryForm } from '../../shared/components/tagCategoryForm';
import { Modal, ModalActions, modalStyles, ModalTitle } from '../../shared/components/modal/modal.styles';
import { BackButton, BackLink, NavigationContainer, NextButton } from '../../shared/components/navigation';
import { TAG_CATEGORIES_PAGE } from '../../modules/project/project.constants';

import {
  ProjectBreadcrumbs,
  tabMessage,
  templatesMessage,
  projectMessage,
  libraryMessage,
  tagsTemplateMessage,
  templateMessage,
} from '../../shared/components/projectBreadcrumbs';

const getBreadcrumbsItems = (project, { name, id }) => [
  {
    path: `/project/${project.id}/`,
    span: projectMessage,
    h3: project.title,
  },
  {
    path: `/project/${project.id}/templates`,
    span: tabMessage,
    h3: templatesMessage,
  },
  {
    path: `/project/${project.id}/tag-templates`,
    span: libraryMessage,
    h3: tagsTemplateMessage,
  },
  {
    path: `/tag-category/${id}`,
    span: templateMessage,
    h3: name,
    active: true,
  },
];

export class TagCategory extends PureComponent {
  static propTypes = {
    userRole: PropTypes.string.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
    dirty: PropTypes.bool.isRequired,
    isValid: PropTypes.bool.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    fetchTagCategory: PropTypes.func.isRequired,
    removeTagCategory: PropTypes.func.isRequired,
    tagCategory: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        tagCategoryId: PropTypes.string.isRequired,
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
      const tagCategoryId = getMatchParam(this.props, 'tagCategoryId');
      await this.props.fetchTagCategory({ tagCategoryId });

      this.setState({ loading: false });
    } catch (error) {
      reportError(error);
      this.setState({ loading: false, error });
    }
  }

  getHeaderAndMenuConfig = () => ({
    headerTitle: <FormattedMessage {...messages.title} />,
    headerSubtitle: <FormattedMessage {...messages.subTitle} />,
  });

  openRemoveCategoryModal = () => this.setState({ confirmationModalOpen: true });

  handleCancelRemove = () => this.setState({ confirmationModalOpen: false });

  handleConfirmRemove = async () => {
    try {
      this.setState({ removeLoading: true });

      const { project, tagCategory } = this.props;
      await this.props.removeTagCategory({ projectId: project.id, tagCategoryId: tagCategory.id });
    } catch (error) {
      this.setState({ removeLoading: false });
      reportError(error);
    }
  };

  render() {
    const { error, loading, removeLoading, confirmationModalOpen } = this.state;
    const { tagCategory, isValid, isSubmitting, dirty, handleSubmit, project } = this.props;
    const headerConfig = this.getHeaderAndMenuConfig();

    return (
      <Container>
        <MobileMenu {...headerConfig} />
        <ContextHeader title={headerConfig.headerTitle} subtitle={headerConfig.headerSubtitle} />
        <LoadingWrapper loading={loading} error={error}>
          <ProjectBreadcrumbs items={getBreadcrumbsItems(project, tagCategory)} />
          <Form onSubmit={handleSubmit}>
            <TagCategoryForm openRemoveCategoryModal={this.openRemoveCategoryModal} {...this.props} />
            <NavigationContainer fixed>
              <BackLink to={`/project/${pathOr('', ['project', 'id'], this.props)}/${TAG_CATEGORIES_PAGE}`} />
              <NextButton
                id="saveBtn"
                loading={isSubmitting}
                disabled={!dirty || !isValid || isSubmitting}
                type="submit"
              >
                <FormattedMessage {...messages.saveTagCategory} />
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
