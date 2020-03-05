import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { AccordionDetails, AccordionHeader, AccordionPanel, Icons } from 'schemaUI';
import { useIntl } from 'react-intl';
import { equals } from 'ramda';

import { customLabelStyles, Header, IconsContainer, InputContainer } from './blockElementTemplate.styles';
import messages from './blockElementTemplate.messages';
import { TextInput } from '../form/inputs/textInput';
import {
  BLOCK_TEMPLATES_ELEMENTS,
  ELEMENT_NAME,
  ELEMENT_PARAMS,
  ELEMENT_TYPE,
  ELEMENTS_TYPES,
  PARAMS_BLOCK,
  STACK_TYPE,
} from '../../../modules/blockTemplates/blockTemplates.constants';
import { Select } from '../form/select';
import { renderWhenTrue } from '../../utils/rendering';

const { EditIcon } = Icons;

export const BlockElementTemplate = memo(
  ({ element: { name, type, params }, handleChange, index, setFieldValue, blocksOptions, ...restFormikProps }) => {
    const intl = useIntl();
    const elementPath = `${BLOCK_TEMPLATES_ELEMENTS}.${index}`;
    const typesOptions = ELEMENTS_TYPES.map(item => ({ label: intl.formatMessage(messages[item]), value: item }));
    const handleSelectStatus = ({ value }) => setFieldValue(`${elementPath}.${ELEMENT_TYPE}`, value);
    const handleSelectBlock = ({ value }) => setFieldValue(`${elementPath}.${ELEMENT_PARAMS}.${PARAMS_BLOCK}`, value);

    const getAdditionalInputs = renderWhenTrue(() => (
      <InputContainer>
        <Select
          label={intl.formatMessage(messages[PARAMS_BLOCK])}
          name={`${elementPath}.${ELEMENT_PARAMS}.${PARAMS_BLOCK}`}
          value={params[PARAMS_BLOCK] || ''}
          options={blocksOptions}
          onSelect={handleSelectBlock}
          placeholder={intl.formatMessage(messages.blockPlaceholder)}
          customLabelStyles={customLabelStyles}
          {...restFormikProps}
        />
      </InputContainer>
    ));

    return (
      <AccordionPanel>
        <AccordionHeader>
          <Header>
            <TextInput
              name={`${elementPath}.${ELEMENT_NAME}`}
              placeholder={intl.formatMessage(messages.namePlaceholder)}
              onChange={handleChange}
              autoWidth
              fullWidth
              value={name}
              {...restFormikProps}
            />
            <IconsContainer>
              <EditIcon />
            </IconsContainer>
          </Header>
        </AccordionHeader>
        <AccordionDetails>
          <InputContainer>
            <Select
              label={intl.formatMessage(messages[ELEMENT_TYPE])}
              name={`${elementPath}.${ELEMENT_TYPE}`}
              value={type}
              options={typesOptions}
              onSelect={handleSelectStatus}
              placeholder={intl.formatMessage(messages.typePlaceholder)}
              customLabelStyles={customLabelStyles}
              {...restFormikProps}
            />
          </InputContainer>
          {getAdditionalInputs(equals(STACK_TYPE, type))}
        </AccordionDetails>
      </AccordionPanel>
    );
  }
);

BlockElementTemplate.propTypes = {
  element: PropTypes.object.isRequired,
  blocksOptions: PropTypes.array.isRequired,
  index: PropTypes.number.isRequired,
  handleChange: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
};
