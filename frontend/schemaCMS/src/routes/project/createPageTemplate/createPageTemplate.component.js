import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { useEffectOnce } from 'react-use';
import Helmet from 'react-helmet';
import { useHistory, useParams } from 'react-router';
import { useFormik } from 'formik';
import { pick } from 'ramda';

import { Container } from './createPageTemplate.styles';
import messages from './createPageTemplate.messages';
import reportError from '../../../shared/utils/reportError';
import { getProjectMenuOptions } from '../project.constants';
import { MobileMenu } from '../../../shared/components/menu/mobileMenu';
import { errorMessageParser, filterMenuOptions } from '../../../shared/utils/helpers';
import { LoadingWrapper } from '../../../shared/components/loadingWrapper';
import { BackButton, NavigationContainer, NextButton } from '../../../shared/components/navigation';
import {
  PAGE_TEMPLATES_SCHEMA,
  INITIAL_VALUES,
  PAGE_TEMPLATES_NAME,
  PAGE_TEMPLATES_BLOCKS,
  BLOCK_NAME,
  BLOCK_TYPE,
  BLOCK_ID,
  getDefaultPageBlock,
} from '../../../modules/pageTemplates/pageTemplates.constants';
import { PageTemplateForm } from '../../../shared/components/pageTemplateForm';
import {
  ProjectBreadcrumbs,
  templatesMessage,
  tabMessage,
  blockTemplatesMessage,
  createMessage,
  projectMessage,
  libraryMessage,
  templateMessage,
} from '../../../shared/components/projectBreadcrumbs';

const getBreadcrumbsItems = project => [
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
    path: `/project/${project.id}/page-templates/create`,
    active: true,
    span: templateMessage,
    h3: createMessage,
  },
];

export const CreatePageTemplate = ({ userRole, createPageTemplate, fetchBlockTemplates, blockTemplates, project }) => {
  const intl = useIntl();
  const { projectId } = useParams();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [createLoading, setCreateLoading] = useState(false);
  const { handleSubmit, isValid, dirty, ...restFormikProps } = useFormik({
    initialValues: { ...INITIAL_VALUES, [PAGE_TEMPLATES_BLOCKS]: [getDefaultPageBlock()] },
    validationSchema: () => PAGE_TEMPLATES_SCHEMA,
    initialErrors: { [PAGE_TEMPLATES_NAME]: 'required' },
    onSubmit: async (formData, { setErrors }) => {
      try {
        setCreateLoading(true);
        await createPageTemplate({
          projectId,
          formData: {
            ...formData,
            [PAGE_TEMPLATES_BLOCKS]: formData[PAGE_TEMPLATES_BLOCKS].map((block, index) => ({
              ...pick([BLOCK_NAME, BLOCK_TYPE, BLOCK_ID])(block),
              order: index,
            })),
          },
        });
        history.push(`/project/${projectId}/page-templates`);
      } catch (errors) {
        reportError(errors);
        const { formatMessage } = intl;
        const errorMessages = errorMessageParser({ errors, messages, formatMessage });

        setErrors(errorMessages);
        setCreateLoading(false);
      }
    },
  });
  const title = <FormattedMessage {...messages.title} />;
  const subtitle = <FormattedMessage {...messages.subtitle} />;
  const menuOptions = getProjectMenuOptions(projectId);

  useEffectOnce(() => {
    (async () => {
      try {
        await fetchBlockTemplates({ projectId });
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    })();
  });

  return (
    <Container>
      <Helmet title={intl.formatMessage(messages.title)} />
      <MobileMenu headerTitle={title} headerSubtitle={subtitle} options={filterMenuOptions(menuOptions, userRole)} />
      <ProjectBreadcrumbs items={getBreadcrumbsItems(project)} />
      <LoadingWrapper loading={loading} error={error}>
        <form onSubmit={handleSubmit}>
          <PageTemplateForm title={title} blockTemplates={blockTemplates} isValid={isValid} {...restFormikProps} />
          <NavigationContainer fixed>
            <BackButton
              id="cancelBtn"
              type="button"
              onClick={() => history.push(`/project/${projectId}/page-templates`)}
            >
              <FormattedMessage {...messages.cancel} />
            </BackButton>
            <NextButton
              id="createTemplateBlock"
              type="submit"
              loading={createLoading}
              disabled={!isValid || !dirty || createLoading}
            >
              <FormattedMessage {...messages.save} />
            </NextButton>
          </NavigationContainer>
        </form>
      </LoadingWrapper>
    </Container>
  );
};

CreatePageTemplate.propTypes = {
  userRole: PropTypes.string.isRequired,
  blockTemplates: PropTypes.array.isRequired,
  createPageTemplate: PropTypes.func.isRequired,
  fetchBlockTemplates: PropTypes.func.isRequired,
  project: PropTypes.object.isRequired,
};
