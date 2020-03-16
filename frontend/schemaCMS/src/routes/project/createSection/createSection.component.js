import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import Helmet from 'react-helmet';
import { useHistory, useParams } from 'react-router';
import { useFormik } from 'formik';

import { Container, Form } from './createSection.styles';
import messages from './createSection.messages';
import { MobileMenu } from '../../../shared/components/menu/mobileMenu';
import { filterMenuOptions } from '../../../shared/utils/helpers';
import { getProjectMenuOptions, PROJECT_CONTENT_ID } from '../project.constants';
import { ProjectTabs } from '../../../shared/components/projectTabs';
import { CONTENT } from '../../../shared/components/projectTabs/projectTabs.constants';
import { ContextHeader } from '../../../shared/components/contextHeader';
import { INITIAL_VALUES, SECTIONS_NAME, SECTIONS_SCHEMA } from '../../../modules/sections/sections.constants';
import reportError from '../../../shared/utils/reportError';
import { TextInput } from '../../../shared/components/form/inputs/textInput';
import { BackButton, NavigationContainer, NextButton } from '../../../shared/components/navigation';

export const CreateSection = ({ userRole, createSection }) => {
  const intl = useIntl();
  const history = useHistory();
  const [createLoading, setCreateLoading] = useState(false);
  const { projectId } = useParams();
  const title = <FormattedMessage {...messages.title} />;
  const subtitle = <FormattedMessage {...messages.subtitle} />;
  const menuOptions = getProjectMenuOptions(projectId);
  const { handleSubmit, handleChange, values, isValid, dirty, ...restFormikProps } = useFormik({
    initialValues: INITIAL_VALUES,
    validationSchema: () => SECTIONS_SCHEMA,
    onSubmit: async formData => {
      try {
        setCreateLoading(true);
        await createSection({ projectId, formData });
        setCreateLoading(false);
        history.push(`/project/${projectId}/content`);
      } catch (e) {
        reportError(e);
        setCreateLoading(false);
      }
    },
  });

  return (
    <Container>
      <Helmet title={intl.formatMessage(messages.title)} />
      <MobileMenu
        headerTitle={title}
        headerSubtitle={subtitle}
        options={filterMenuOptions(menuOptions, userRole)}
        active={PROJECT_CONTENT_ID}
      />
      <ProjectTabs active={CONTENT} url={`/project/${projectId}`} />
      <ContextHeader title={title} subtitle={subtitle} />
      <Form onSubmit={handleSubmit}>
        <TextInput
          onChange={handleChange}
          name={SECTIONS_NAME}
          value={values[SECTIONS_NAME]}
          label={<FormattedMessage {...messages[SECTIONS_NAME]} />}
          fullWidth
          autoFocus
          {...restFormikProps}
        />
        <NavigationContainer fixed>
          <BackButton id="cancelBtn" type="button" onClick={() => history.push(`/project/${projectId}/content`)}>
            <FormattedMessage {...messages.cancel} />
          </BackButton>
          <NextButton
            id="createSection"
            type="submit"
            loading={createLoading}
            disabled={!isValid || !dirty || createLoading}
          >
            <FormattedMessage {...messages.create} />
          </NextButton>
        </NavigationContainer>
      </Form>
    </Container>
  );
};

CreateSection.propTypes = {
  userRole: PropTypes.string.isRequired,
  createSection: PropTypes.func.isRequired,
};
