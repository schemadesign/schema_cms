import React from 'react';
import PropTypes from 'prop-types';
import { AccordionDetails, AccordionHeader, AccordionPanel, Icons } from 'schemaUI';
import { useIntl } from 'react-intl';
import { equals } from 'ramda';

import {
  customLabelStyles,
  Header,
  IconsContainer,
  iconStyles,
  InputContainer,
  ElementIcon,
} from './elementBlockTemplate.styles';
import messages from './elementBlockTemplate.messages';
import { TextInput } from '../form/inputs/textInput';
import {
  BLOCK_TEMPLATES_ELEMENTS,
  ELEMENT_AUTO_OPEN,
  ELEMENT_NAME,
  ELEMENT_PARAMS,
  ELEMENT_TYPE,
  ELEMENTS_TYPES,
  PARAMS_BLOCK,
  STACK_TYPE,
} from '../../../modules/blockTemplates/blockTemplates.constants';
import { Select } from '../form/select';
import { renderWhenTrue } from '../../utils/rendering';

const { EditIcon, MinusIcon } = Icons;

export const ElementBlockTemplate = ({
  element,
  handleChange,
  index,
  setFieldValue,
  blocksOptions,
  removeElement,
  draggableIcon,
  autoFocus,
  ...restFormikProps
}) => {
  const intl = useIntl();
  const elementPath = `${BLOCK_TEMPLATES_ELEMENTS}.${index}`;
  const typesOptions = ELEMENTS_TYPES.map(item => ({ label: intl.formatMessage(messages[item]), value: item }));
  const handleSelectType = ({ value }) => setFieldValue(`${elementPath}.${ELEMENT_TYPE}`, value);
  const handleSelectBlock = ({ value }) => setFieldValue(`${elementPath}.${ELEMENT_PARAMS}.${PARAMS_BLOCK}`, value);
  const getAdditionalInputs = renderWhenTrue(() => (
    <InputContainer>
      <Select
        label={intl.formatMessage(messages[PARAMS_BLOCK])}
        name={`${elementPath}.${ELEMENT_PARAMS}.${PARAMS_BLOCK}`}
        value={element[ELEMENT_PARAMS][PARAMS_BLOCK] || ''}
        options={blocksOptions}
        id="elementBlockSelect"
        onSelect={handleSelectBlock}
        placeholder={intl.formatMessage(messages[blocksOptions.length ? 'blockPlaceholder' : 'noBlocksPlaceholder'])}
        customLabelStyles={customLabelStyles}
        {...restFormikProps}
      />
    </InputContainer>
  ));
  const isStackType = equals(STACK_TYPE, element[ELEMENT_TYPE]);

  return (
    <AccordionPanel autoOpen={element[ELEMENT_AUTO_OPEN]}>
      <AccordionHeader>
        <Header>
          <IconsContainer>
            {draggableIcon}
            <ElementIcon>
              <MinusIcon />
            </ElementIcon>
          </IconsContainer>
          <TextInput
            name={`${elementPath}.${ELEMENT_NAME}`}
            placeholder={intl.formatMessage(messages.namePlaceholder)}
            onChange={handleChange}
            autoWidth
            fullWidth
            value={element[ELEMENT_NAME]}
            autoFocus={autoFocus && !element[ELEMENT_NAME].length}
            {...restFormikProps}
          />
          <IconsContainer>
            <EditIcon />
            <MinusIcon id={`removeElement-${index}`} customStyles={iconStyles} onClick={() => removeElement(index)} />
          </IconsContainer>
        </Header>
      </AccordionHeader>
      <AccordionDetails>
        <InputContainer>
          <Select
            label={intl.formatMessage(messages[ELEMENT_TYPE])}
            name={`${elementPath}.${ELEMENT_TYPE}`}
            value={element[ELEMENT_TYPE]}
            id="elementTypeSelect"
            options={typesOptions}
            onSelect={handleSelectType}
            placeholder={intl.formatMessage(messages.typePlaceholder)}
            customLabelStyles={customLabelStyles}
            {...restFormikProps}
          />
        </InputContainer>
        {getAdditionalInputs(isStackType)}
      </AccordionDetails>
    </AccordionPanel>
  );
};

ElementBlockTemplate.propTypes = {
  element: PropTypes.object.isRequired,
  blocksOptions: PropTypes.array.isRequired,
  index: PropTypes.number.isRequired,
  handleChange: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  removeElement: PropTypes.func.isRequired,
  draggableIcon: PropTypes.element.isRequired,
  autoFocus: PropTypes.bool.isRequired,
};
