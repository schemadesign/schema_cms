import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { useHistory, useParams } from 'react-router';
import { useFormik } from 'formik';
import { useEffectOnce } from 'react-use';
import Helmet from 'react-helmet';
import { pick } from 'ramda';

import { Container } from './pageTemplate.styles';
import messages from './pageTemplate.messages';
import reportError from '../../shared/utils/reportError';
import { getProjectMenuOptions } from '../project/project.constants';
import { MobileMenu } from '../../shared/components/menu/mobileMenu';
import { errorMessageParser, filterMenuOptions } from '../../shared/utils/helpers';
import { LoadingWrapper } from '../../shared/components/loadingWrapper';
import { PageTemplateForm } from '../../shared/components/pageTemplateForm';
import { BackButton, NavigationContainer, NextButton } from '../../shared/components/navigation';
import { Modal, ModalActions, modalStyles, ModalTitle } from '../../shared/components/modal/modal.styles';
import {
  BLOCK_ID,
  BLOCK_TYPE,
  BLOCK_NAME,
  PAGE_TEMPLATES_BLOCKS,
  PAGE_TEMPLATES_SCHEMA,
  BLOCK_KEY,
  PAGE_TEMPLATES_NAME,
  PAGE_TEMPLATES_ALLOW_EDIT,
  PAGE_TEMPLATES_IS_AVAILABLE,
} from '../../modules/pageTemplates/pageTemplates.constants';

import {
  blockTemplatesMessage,
  libraryMessage,
  ProjectBreadcrumbs,
  projectMessage,
  tabMessage,
  templateMessage,
  templatesMessage,
} from '../../shared/components/projectBreadcrumbs';

const getBreadcrumbsItems = (project, { id = '', name = '' }) => [
  {
    path: `/project/${project.id}/`,
    active: false,
    span: projectMessage,
    h3: project.title,
  },
  {
    path: `/project/${project.id}/templates`,
    active: false,
    span: tabMessage,
    h3: templatesMessage,
  },
  {
    path: `/project/${project.id}/block-templates`,
    active: false,
    span: libraryMessage,
    h3: blockTemplatesMessage,
  },
  {
    path: `/page-template/${id}`,
    active: true,
    span: templateMessage,
    h3: name,
  },
];

export const PageTemplate = memo(
  ({
    updatePageTemplate,
    fetchPageTemplate,
    fetchBlockTemplates,
    removePageTemplate,
    userRole,
    pageTemplate,
    blockTemplates,
    project,
  }) => {
    const { pageTemplateId } = useParams();
    const history = useHistory();
    const intl = useIntl();
    const [loading, setLoading] = useState(true);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [error, setError] = useState(null);
    const [removeModalOpen, setRemoveModalOpen] = useState(false);
    const [removeLoading, setRemoveLoading] = useState(false);
    const handleConfirmRemove = async () => {
      try {
        setRemoveLoading(true);
        await removePageTemplate({ pageTemplateId });
        history.push(`/project/${project.id}/page-templates`);
      } catch (e) {
        reportError(e);
        setRemoveLoading(false);
      }
    };

    const menuOptions = getProjectMenuOptions();
    const { handleSubmit, isValid, dirty, ...restFormikProps } = useFormik({
      initialValues: {
        ...pick([PAGE_TEMPLATES_NAME, PAGE_TEMPLATES_ALLOW_EDIT, PAGE_TEMPLATES_IS_AVAILABLE], pageTemplate),
        blocks: pageTemplate[PAGE_TEMPLATES_BLOCKS].map(block => ({
          ...pick([BLOCK_NAME, BLOCK_TYPE, BLOCK_ID], block),
          [BLOCK_KEY]: block[BLOCK_ID],
        })),
      },
      enableReinitialize: true,
      validationSchema: () => PAGE_TEMPLATES_SCHEMA,
      onSubmit: async (formData, { setErrors }) => {
        try {
          setUpdateLoading(true);
          await updatePageTemplate({
            pageTemplateId,
            formData: {
              ...formData,
              [PAGE_TEMPLATES_BLOCKS]: formData[PAGE_TEMPLATES_BLOCKS].map((block, index) => ({
                ...pick([BLOCK_NAME, BLOCK_TYPE, BLOCK_ID])(block),
                order: index,
              })),
            },
          });
          setUpdateLoading(false);
          history.push(`/project/${project.id}/page-templates`);
        } catch (errors) {
          reportError(errors);
          const { formatMessage } = intl;
          const errorMessages = errorMessageParser({ errors, messages, formatMessage });

          setErrors(errorMessages);
          setUpdateLoading(false);
        }
      },
    });

    useEffectOnce(() => {
      (async () => {
        try {
          const { project } = await fetchPageTemplate({ pageTemplateId });

          await fetchBlockTemplates({ projectId: project, raw: true });
        } catch (e) {
          reportError(e);
          setError(e);
        } finally {
          setLoading(false);
        }
      })();
    });
    const title = <FormattedMessage {...messages.title} />;
    const subtitle = <FormattedMessage {...messages.subtitle} />;

    return (
      <Container>
        <Helmet title={intl.formatMessage(messages.title)} />
        <MobileMenu headerTitle={title} headerSubtitle={subtitle} options={filterMenuOptions(menuOptions, userRole)} />
        <ProjectBreadcrumbs items={getBreadcrumbsItems(project, pageTemplate)} />
        <LoadingWrapper loading={loading} error={error}>
          <form onSubmit={handleSubmit}>
            <PageTemplateForm
              title={title}
              blockTemplates={blockTemplates}
              setRemoveModalOpen={setRemoveModalOpen}
              isValid={isValid}
              {...restFormikProps}
            />
            <NavigationContainer fixed>
              <BackButton
                id="cancelBtn"
                type="button"
                onClick={() => history.push(`/project/${project.id}/page-templates`)}
              >
                <FormattedMessage {...messages.cancel} />
              </BackButton>
              <NextButton
                id="createTemplatePageMobile"
                type="submit"
                loading={updateLoading}
                disabled={!isValid || !dirty || updateLoading}
              >
                <FormattedMessage {...messages.save} />
              </NextButton>
            </NavigationContainer>
          </form>
        </LoadingWrapper>
        <Modal ariaHideApp={false} isOpen={removeModalOpen} contentLabel="Confirm Removal" style={modalStyles}>
          <ModalTitle>
            <FormattedMessage {...messages.removeTitle} />
          </ModalTitle>
          <ModalActions>
            <BackButton onClick={() => setRemoveModalOpen(false)} disabled={removeLoading}>
              <FormattedMessage {...messages.cancelRemoval} />
            </BackButton>
            <NextButton
              id="confirmRemovalBtn"
              onClick={handleConfirmRemove}
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
);

PageTemplate.propTypes = {
  pageTemplate: PropTypes.object.isRequired,
  blockTemplates: PropTypes.array.isRequired,
  project: PropTypes.object.isRequired,
  userRole: PropTypes.string.isRequired,
  fetchPageTemplate: PropTypes.func.isRequired,
  updatePageTemplate: PropTypes.func.isRequired,
  fetchBlockTemplates: PropTypes.func.isRequired,
  removePageTemplate: PropTypes.func.isRequired,
};
