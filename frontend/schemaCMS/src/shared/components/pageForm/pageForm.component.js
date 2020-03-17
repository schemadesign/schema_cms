import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { Icons } from 'schemaUI';

import { Container } from './pageForm.styles';
import {
  IconsContainer,
  inputContainerStyles,
  inputStyles,
  MobileInputName,
  Subtitle,
} from '../form/frequentComponents.styles';
import { TextInput } from '../form/inputs/textInput';
import messages from './pageForm.messages';
import { ContextHeader } from '../contextHeader';
import { PAGE_NAME, PAGE_DESCRIPTION, PAGE_DISPLAY_NAME, PAGE_KEYWORDS } from '../../../modules/page/page.constants';

const { EditIcon } = Icons;

export const PageForm = ({ title, values, handleChange, ...restFormikProps }) => {
  const intl = useIntl();
  const nameInput = (
    <Subtitle>
      <TextInput
        onChange={handleChange}
        name={PAGE_NAME}
        value={values[PAGE_NAME]}
        customInputStyles={inputStyles}
        customStyles={inputContainerStyles}
        autoWidth
        fullWidth
        autoFocus={!values[PAGE_NAME].length}
        placeholder={intl.formatMessage(messages[`${PAGE_NAME}Placeholder`])}
        {...restFormikProps}
      />
      <IconsContainer>
        <EditIcon />
      </IconsContainer>
    </Subtitle>
  );

  return (
    <Container>
      <ContextHeader title={title} subtitle={nameInput} />
      <MobileInputName>
        <TextInput
          onChange={handleChange}
          name={PAGE_NAME}
          value={values[PAGE_NAME]}
          label={<FormattedMessage {...messages[PAGE_NAME]} />}
          fullWidth
          autoFocus={!values[PAGE_NAME].length}
          isEdit
          {...restFormikProps}
        />
      </MobileInputName>
      <TextInput
        onChange={handleChange}
        name={PAGE_DISPLAY_NAME}
        value={values[PAGE_DISPLAY_NAME]}
        fullWidth
        label={<FormattedMessage {...messages[PAGE_DISPLAY_NAME]} />}
        {...restFormikProps}
      />
      <TextInput
        onChange={handleChange}
        name={PAGE_DESCRIPTION}
        value={values[PAGE_DESCRIPTION]}
        fullWidth
        multiline
        label={<FormattedMessage {...messages[PAGE_DESCRIPTION]} />}
        {...restFormikProps}
      />
      <TextInput
        onChange={handleChange}
        name={PAGE_KEYWORDS}
        value={values[PAGE_KEYWORDS]}
        fullWidth
        label={<FormattedMessage {...messages[PAGE_KEYWORDS]} />}
        {...restFormikProps}
      />
    </Container>
  );
};

PageForm.propTypes = {
  handleChange: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  setValues: PropTypes.func.isRequired,
  setRemoveModalOpen: PropTypes.func,
  values: PropTypes.object.isRequired,
  pageTemplates: PropTypes.array.isRequired,
  isValid: PropTypes.bool.isRequired,
  title: PropTypes.node.isRequired,
};
