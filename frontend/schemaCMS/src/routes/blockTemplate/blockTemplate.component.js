import React, { useState, memo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { useFormik } from 'formik';
import Helmet from 'react-helmet';
import { useHistory, useParams } from 'react-router';
import { useEffectOnce } from 'react-use';
import { pick } from 'ramda';

import { Container } from './blockTemplate.styles';
import messages from './blockTemplate.messages';
import { MobileMenu } from '../../shared/components/menu/mobileMenu';
import { errorMessageParser, filterMenuOptions } from '../../shared/utils/helpers';
import {
  BLOCK_TEMPLATES_DELETE_ELEMENTS,
  BLOCK_TEMPLATES_SCHEMA,
  ELEMENT_ID,
  ELEMENT_NAME,
  ELEMENT_PARAMS,
  ELEMENT_TYPE,
  INITIAL_VALUES,
} from '../../modules/blockTemplates/blockTemplates.constants';
import { BlockTemplateForm } from '../../shared/components/blockTemplateForm';
import { BackButton, NavigationContainer, NextButton } from '../../shared/components/navigation';
import { getProjectMenuOptions } from '../project/project.constants';
import { LoadingWrapper } from '../../shared/components/loadingWrapper';
import reportError from '../../shared/utils/reportError';
import { Modal, ModalActions, modalStyles, ModalTitle } from '../../shared/components/modal/modal.styles';
import {
  blockTemplatesMessage,
  libraryMessage,
  ProjectBreadcrumbs,
  projectMessage,
  tabMessage,
  templateMessage,
  templatesMessage,
} from '../../shared/components/projectBreadcrumbs';

const getBreadcrumbsItems = (project, { id, name }) => [
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
    path: `/project/${project.id}/block-templates`,
    span: libraryMessage,
    h3: blockTemplatesMessage,
  },
  {
    path: `/block-template/${id}`,
    active: true,
    span: templateMessage,
    h3: name,
  },
];

export const BlockTemplate = memo(
  ({
    updateBlockTemplate,
    fetchBlockTemplate,
    removeBlockTemplate,
    fetchProject,
    userRole,
    blockTemplate: { name, elements, isAvailable, allowEdit, project: projectId },
    project,
  }) => {
    const { blockTemplateId } = useParams();
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
        await removeBlockTemplate({ blockTemplateId });
        history.push(`/project/${project.id}/block-templates`);
      } catch (e) {
        reportError(e);
        setRemoveLoading(false);
      }
    };

    const menuOptions = getProjectMenuOptions(project.id);
    const { handleSubmit, isValid, dirty, ...restFormikProps } = useFormik({
      initialValues: {
        ...INITIAL_VALUES,
        name,
        isAvailable,
        allowEdit,
        elements: elements.map(element => ({
          ...pick([ELEMENT_NAME, ELEMENT_TYPE, ELEMENT_ID, ELEMENT_PARAMS], element),
          key: element.id,
        })),
        [BLOCK_TEMPLATES_DELETE_ELEMENTS]: [],
      },
      enableReinitialize: true,
      validationSchema: () => BLOCK_TEMPLATES_SCHEMA,
      onSubmit: async (formData, { setErrors }) => {
        try {
          setUpdateLoading(true);
          formData.elements = formData.elements.map((data, index) => ({ ...data, order: index }));
          await updateBlockTemplate({ blockTemplateId, formData });
          setUpdateLoading(false);
          history.push(`/project/${project.id}/block-templates`);
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
          await fetchBlockTemplate({ blockTemplateId });
        } catch (e) {
          reportError(e);
          setError(e);
        } finally {
          setLoading(false);
        }
      })();
    });

    useEffect(() => {
      if (projectId) {
        fetchProject({ projectId });
      }
    }, [projectId]);

    const title = <FormattedMessage {...messages.title} />;
    const subtitle = <FormattedMessage {...messages.subtitle} />;

    return (
      <Container>
        <Helmet title={intl.formatMessage(messages.title)} />
        <MobileMenu headerTitle={title} headerSubtitle={subtitle} options={filterMenuOptions(menuOptions, userRole)} />
        <LoadingWrapper loading={loading} error={error}>
          <ProjectBreadcrumbs items={getBreadcrumbsItems(project, { id: blockTemplateId, name })} />
          <form onSubmit={handleSubmit}>
            <BlockTemplateForm
              title={title}
              setRemoveModalOpen={setRemoveModalOpen}
              isValid={isValid}
              {...restFormikProps}
            />
            <NavigationContainer fixed>
              <BackButton
                id="cancelBtn"
                type="button"
                onClick={() => history.push(`/project/${project.id}/block-templates`)}
              >
                <FormattedMessage {...messages.cancel} />
              </BackButton>
              <NextButton
                id="createTemplateBlockMobile"
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

BlockTemplate.propTypes = {
  blockTemplate: PropTypes.object.isRequired,
  project: PropTypes.object.isRequired,
  userRole: PropTypes.string.isRequired,
  fetchBlockTemplate: PropTypes.func.isRequired,
  updateBlockTemplate: PropTypes.func.isRequired,
  removeBlockTemplate: PropTypes.func.isRequired,
  fetchProject: PropTypes.func.isRequired,
};
