import React, { memo } from 'react';
import { Icons } from 'schemaUI';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { Container, IconsContainer, inputContainerStyles, inputStyles, Subtitle } from './blockTemplateForm.styles';
import messages from './blockTemplateForm.messages';
import { ContextHeader } from '../contextHeader';
import { PlusButton } from '../navigation';
import { TextInput } from '../form/inputs/textInput';
import { BLOCK_TEMPLATES_NAME } from '../../../modules/blockTemplates/blockTemplates.constants';

const { EditIcon } = Icons;

export const BlockTemplateForm = memo(({ title, handleChange, values, ...restFormikProps }) => {
  const intl = useIntl();
  const nameInput = (
    <Subtitle>
      <TextInput
        onChange={handleChange}
        name={BLOCK_TEMPLATES_NAME}
        value={values[BLOCK_TEMPLATES_NAME]}
        customInputStyles={inputStyles}
        customStyles={inputContainerStyles}
        autoWidth
        fullWidth
        placeholder={intl.formatMessage(messages[`${BLOCK_TEMPLATES_NAME}Placeholder`])}
        {...restFormikProps}
      />
      <IconsContainer>
        <EditIcon />
      </IconsContainer>
    </Subtitle>
  );

  return (
    <Container>
      <ContextHeader title={title} subtitle={nameInput}>
        <PlusButton id="createElement" onClick={() => {}} type="button" />
      </ContextHeader>
    </Container>
  );
});

BlockTemplateForm.propTypes = {
  handleChange: PropTypes.func.isRequired,
  values: PropTypes.object.isRequired,
  title: PropTypes.node.isRequired,
};
