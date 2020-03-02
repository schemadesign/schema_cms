import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import Helmet from 'react-helmet';
import { useFormik } from 'formik';
import { useHistory, useParams } from 'react-router';
import { Icons } from 'schemaUI';

import { Container, inputStyles, inputContainerStyles, Subtitle, IconsContainer } from './createBlockTemplate.styles';
import messages from './createBlockTemplate.messages';
import { MobileMenu } from '../../../shared/components/menu/mobileMenu';
import { filterMenuOptions } from '../../../shared/utils/helpers';
import { ContextHeader } from '../../../shared/components/contextHeader';
import { PlusButton, NavigationContainer, NextButton, BackButton } from '../../../shared/components/navigation';
import { getProjectMenuOptions } from '../project.constants';
import { TextInput } from '../../../shared/components/form/inputs/textInput';
import { BLOCK_TEMPLATES_SCHEMA, INITIAL_VALUES } from '../../../modules/blockTemplates/blockTemplates.constants';

const { EditIcon } = Icons;

export const CreateBlockTemplate = memo(({ userRole, createBlockTemplate }) => {
  const intl = useIntl();
  const { projectId } = useParams();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const { handleSubmit, handleChange, values, isValid, ...restFormikProps } = useFormik({
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
  const subtitle = (
    <Subtitle>
      <TextInput
        onChange={handleChange}
        name="name"
        value={values.name}
        customInputStyles={inputStyles}
        customStyles={inputContainerStyles}
        autoWidth
        fullWidth
        placeholder="Name"
        {...restFormikProps}
      />
      <IconsContainer>
        <EditIcon />
      </IconsContainer>
    </Subtitle>
  );
  const menuOptions = getProjectMenuOptions(projectId);

  return (
    <Container>
      <Helmet title={intl.formatMessage(messages.title)} />
      <form onSubmit={handleSubmit}>
        <MobileMenu headerTitle={title} headerSubtitle={subtitle} options={filterMenuOptions(menuOptions, userRole)} />
        <ContextHeader title={title} subtitle={subtitle}>
          <PlusButton id="createElement" onClick={() => {}} type="button" />
        </ContextHeader>
        <NavigationContainer fixed>
          <BackButton
            id="cancelBtn"
            type="button"
            onClick={() => history.push(`/project/${projectId}/block-templates`)}
          >
            <FormattedMessage {...messages.cancel} />
          </BackButton>
          <NextButton id="createTemplateBlockMobile" type="submit" loading={loading} disabled={!isValid || loading}>
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
