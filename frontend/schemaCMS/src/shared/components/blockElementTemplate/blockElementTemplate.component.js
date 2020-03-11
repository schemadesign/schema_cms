import React from 'react';
import PropTypes from 'prop-types';
import { AccordionDetails, AccordionHeader, AccordionPanel, Icons } from 'schemaUI';
import { useIntl } from 'react-intl';
import { equals } from 'ramda';

import {
  customLabelStyles,
  elementIcon,
  Header,
  IconsContainer,
  iconStyles,
  INPUT_HEIGHT,
  InputContainer,
} from './blockElementTemplate.styles';
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

const { EditIcon, MinusIcon } = Icons;

export const BlockElementTemplate = ({
  element: { name, type, params, autoOpen },
  handleChange,
  index,
  setFieldValue,
  blocksOptions,
  removeElement,
  draggableIcon,
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
        value={params[PARAMS_BLOCK] || ''}
        options={blocksOptions}
        id="elementBlockSelect"
        onSelect={handleSelectBlock}
        placeholder={intl.formatMessage(messages[blocksOptions.length ? 'blockPlaceholder' : 'noBlocksPlaceholder'])}
        customLabelStyles={customLabelStyles}
        {...restFormikProps}
      />
    </InputContainer>
  ));
  const isStackType = equals(STACK_TYPE, type);

  return (
    <AccordionPanel autoOpen={autoOpen}>
      <AccordionHeader>
        <Header>
          <IconsContainer>
            {draggableIcon}
            <MinusIcon customStyles={elementIcon} />
          </IconsContainer>
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
            <MinusIcon id={`removeElement-${index}`} customStyles={iconStyles} onClick={() => removeElement(index)} />
          </IconsContainer>
        </Header>
      </AccordionHeader>
      <AccordionDetails height={isStackType ? 2 * INPUT_HEIGHT : INPUT_HEIGHT}>
        <InputContainer>
          <Select
            label={intl.formatMessage(messages[ELEMENT_TYPE])}
            name={`${elementPath}.${ELEMENT_TYPE}`}
            value={type}
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

BlockElementTemplate.propTypes = {
  element: PropTypes.object.isRequired,
  blocksOptions: PropTypes.array.isRequired,
  index: PropTypes.number.isRequired,
  handleChange: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  removeElement: PropTypes.func.isRequired,
  draggableIcon: PropTypes.element.isRequired,
};
