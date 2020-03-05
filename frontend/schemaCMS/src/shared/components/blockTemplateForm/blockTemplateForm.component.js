import React, { memo } from 'react';
import { Icons, Accordion } from 'schemaUI';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { prepend } from 'ramda';

import { Container, IconsContainer, inputContainerStyles, inputStyles, Subtitle } from './blockTemplateForm.styles';
import messages from './blockTemplateForm.messages';
import { ContextHeader } from '../contextHeader';
import { PlusButton } from '../navigation';
import { TextInput } from '../form/inputs/textInput';
import {
  BLOCK_TEMPLATES_ELEMENTS,
  BLOCK_TEMPLATES_NAME,
  BLOCK_TEMPLATE_DEFAULT_ELEMENT,
} from '../../../modules/blockTemplates/blockTemplates.constants';
import { BlockElementTemplate } from '../blockElementTemplate';
import { CounterHeader } from '../counterHeader';

const { EditIcon } = Icons;

export const BlockTemplateForm = memo(
  ({ title, handleChange, setFieldValue, values, blockTemplates, ...restFormikProps }) => {
    const intl = useIntl();
    const blocksOptions = blockTemplates.map(({ name }) => ({ label: name, value: name }));

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

    const addElement = () =>
      setFieldValue(
        BLOCK_TEMPLATES_ELEMENTS,
        prepend(BLOCK_TEMPLATE_DEFAULT_ELEMENT, values[BLOCK_TEMPLATES_ELEMENTS])
      );

    return (
      <Container>
        <ContextHeader title={title} subtitle={nameInput}>
          <PlusButton id="createElement" onClick={addElement} type="button" />
        </ContextHeader>
        <CounterHeader copy={intl.formatMessage(messages.elements)} count={values[BLOCK_TEMPLATES_ELEMENTS].length} />
        <Accordion>
          {values[BLOCK_TEMPLATES_ELEMENTS].map((element, index) => (
            <BlockElementTemplate
              key={index}
              index={index}
              element={element}
              handleChange={handleChange}
              setFieldValue={setFieldValue}
              blocksOptions={blocksOptions}
              {...restFormikProps}
            />
          ))}
        </Accordion>
      </Container>
    );
  }
);

BlockTemplateForm.propTypes = {
  handleChange: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  values: PropTypes.object.isRequired,
  blockTemplates: PropTypes.array.isRequired,
  title: PropTypes.node.isRequired,
};
