import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import Helmet from 'react-helmet';
import { useFormik } from 'formik';
import { useHistory, useParams } from 'react-router';

import { Container } from './createBlockTemplate.styles';
import messages from './createBlockTemplate.messages';
import { MobileMenu } from '../../../shared/components/menu/mobileMenu';
import { filterMenuOptions } from '../../../shared/utils/helpers';
import { NavigationContainer, NextButton, BackButton } from '../../../shared/components/navigation';
import { getProjectMenuOptions } from '../project.constants';
import { BLOCK_TEMPLATES_SCHEMA, INITIAL_VALUES } from '../../../modules/blockTemplates/blockTemplates.constants';
import { BlockTemplateForm } from '../../../shared/components/blockTemplateForm';

export const CreateBlockTemplate = memo(({ userRole, createBlockTemplate }) => {
  const intl = useIntl();
  const { projectId } = useParams();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const { handleSubmit, isValid, dirty, ...restFormikProps } = useFormik({
    initialValues: INITIAL_VALUES,
    validationSchema: () => BLOCK_TEMPLATES_SCHEMA,
    onSubmit: async formData => {
      try {
        setLoading(true);
        await createBlockTemplate({ projectId, formData });
      } finally {
        setLoading(false);
      }
    },
  });
  const title = <FormattedMessage {...messages.title} />;
  const subtitle = <FormattedMessage {...messages.subtitle} />;
  const menuOptions = getProjectMenuOptions(projectId);

  return (
    <Container>
      <Helmet title={intl.formatMessage(messages.title)} />
      <MobileMenu headerTitle={title} headerSubtitle={subtitle} options={filterMenuOptions(menuOptions, userRole)} />
      <form onSubmit={handleSubmit}>
        <BlockTemplateForm title={title} {...restFormikProps} />
        <NavigationContainer fixed>
          <BackButton
            id="cancelBtn"
            type="button"
            onClick={() => history.push(`/project/${projectId}/block-templates`)}
          >
            <FormattedMessage {...messages.cancel} />
          </BackButton>
          <NextButton id="createTemplateBlock" type="submit" loading={loading} disabled={!isValid || !dirty || loading}>
            <FormattedMessage {...messages.save} />
          </NextButton>
        </NavigationContainer>
      </form>
    </Container>
  );
});

CreateBlockTemplate.propTypes = {
  userRole: PropTypes.string.isRequired,
  createBlockTemplate: PropTypes.func.isRequired,
};
