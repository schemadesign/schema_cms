import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import Helmet from 'react-helmet';
import { useFormik } from 'formik';
import { useHistory, useParams } from 'react-router';

import { Container } from './createBlockTemplate.styles';
import messages from './createBlockTemplate.messages';
import { MobileMenu } from '../../../shared/components/menu/mobileMenu';
import { errorMessageParser, filterMenuOptions } from '../../../shared/utils/helpers';
import { NavigationContainer, NextButton, BackButton } from '../../../shared/components/navigation';
import { getProjectMenuOptions } from '../project.constants';
import {
  BLOCK_TEMPLATES_ELEMENTS,
  BLOCK_TEMPLATES_NAME,
  BLOCK_TEMPLATES_SCHEMA,
  getDefaultBlockElement,
  INITIAL_VALUES,
} from '../../../modules/blockTemplates/blockTemplates.constants';
import { BlockTemplateForm } from '../../../shared/components/blockTemplateForm';
import reportError from '../../../shared/utils/reportError';
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
    path: `/project/${project.id}/block-templates/create`,
    active: true,
    span: templateMessage,
    h3: createMessage,
  },
];

export const CreateBlockTemplate = ({ userRole, createBlockTemplate, project }) => {
  const intl = useIntl();
  const { projectId } = useParams();
  const history = useHistory();
  const [createLoading, setCreateLoading] = useState(false);
  const { handleSubmit, isValid, dirty, ...restFormikProps } = useFormik({
    initialValues: { ...INITIAL_VALUES, [BLOCK_TEMPLATES_ELEMENTS]: [getDefaultBlockElement()] },
    validationSchema: () => BLOCK_TEMPLATES_SCHEMA,
    initialErrors: { [BLOCK_TEMPLATES_NAME]: 'required' },
    onSubmit: async (formData, { setErrors }) => {
      try {
        setCreateLoading(true);
        formData.elements = formData.elements.map((data, index) => ({ ...data, order: index }));
        await createBlockTemplate({ projectId, formData });
        history.push(`/project/${projectId}/block-templates`);
      } catch (errors) {
        reportError(errors);
        const { formatMessage } = intl;
        const errorMessages = errorMessageParser({ errors, messages, formatMessage });

        setErrors(errorMessages);
        setCreateLoading(false);
      }
    },
  });

  const handleBackClick = () => history.push(`/project/${projectId}/block-templates`);

  const title = <FormattedMessage {...messages.title} />;
  const subtitle = <FormattedMessage {...messages.subtitle} />;
  const menuOptions = getProjectMenuOptions(projectId);

  return (
    <Container>
      <Helmet title={intl.formatMessage(messages.title)} />
      <MobileMenu headerTitle={title} headerSubtitle={subtitle} options={filterMenuOptions(menuOptions, userRole)} />
      <ProjectBreadcrumbs items={getBreadcrumbsItems(project)} />
      <form onSubmit={handleSubmit}>
        <BlockTemplateForm title={title} isValid={isValid} {...restFormikProps} />
        <NavigationContainer fixed>
          <BackButton id="cancelBtn" type="button" onClick={handleBackClick}>
            <FormattedMessage {...messages.cancel} />
          </BackButton>
          <NextButton
            id="createBlockTemplateMobile"
            type="submit"
            loading={createLoading}
            disabled={!isValid || !dirty || createLoading}
          >
            <FormattedMessage {...messages.save} />
          </NextButton>
        </NavigationContainer>
      </form>
    </Container>
  );
};

CreateBlockTemplate.propTypes = {
  userRole: PropTypes.string.isRequired,
  createBlockTemplate: PropTypes.func.isRequired,
  project: PropTypes.object.isRequired,
};
