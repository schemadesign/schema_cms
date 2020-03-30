import React from 'react';
import PropTypes from 'prop-types';
import { AccordionDetails, AccordionHeader, AccordionPanel, Icons } from 'schemaUI';
import { useIntl } from 'react-intl';
import { find, pipe, propEq, propOr } from 'ramda';

import {
  customLabelStyles,
  Header,
  IconsContainer,
  iconStyles,
  InputContainer,
  Type,
} from './pageTemplateBlock.styles';
import messages from './pageTemplateBlock.messages';
import { TextInput } from '../form/inputs/textInput';
import { Select } from '../form/select';
import {
  BLOCK_AUTO_OPEN,
  BLOCK_NAME,
  BLOCK_TYPE,
  PAGE_TEMPLATES_BLOCKS,
} from '../../../modules/pageTemplates/pageTemplates.constants';

const { EditIcon, MinusIcon } = Icons;

export const PageTemplateBlock = ({
  block,
  handleChange,
  index,
  setFieldValue,
  blocksOptions,
  removeBlock,
  draggableIcon,
  autoFocus,
  ...restFormikProps
}) => {
  const intl = useIntl();
  const elementPath = `${PAGE_TEMPLATES_BLOCKS}.${index}`;
  const handleSelectBlock = ({ value }) => setFieldValue(`${elementPath}.${BLOCK_TYPE}`, value);
  const type = pipe(find(propEq('value', block[BLOCK_TYPE])), propOr('', 'label'))(blocksOptions);

  return (
    <AccordionPanel autoOpen={block[BLOCK_AUTO_OPEN]}>
      <AccordionHeader>
        <Header>
          <IconsContainer>{draggableIcon}</IconsContainer>
          <TextInput
            name={`${elementPath}.${BLOCK_NAME}`}
            placeholder={intl.formatMessage(messages.namePlaceholder)}
            onChange={handleChange}
            autoWidth
            fullWidth
            value={block[BLOCK_NAME]}
            autoFocus={autoFocus && !name.length}
            {...restFormikProps}
          />
          <IconsContainer>
            <EditIcon />
            <MinusIcon id={`removeBlock-${index}`} customStyles={iconStyles} onClick={() => removeBlock(index)} />
          </IconsContainer>
        </Header>
        <Type>{type}</Type>
      </AccordionHeader>
      <AccordionDetails>
        <InputContainer>
          <Select
            label={intl.formatMessage(messages[BLOCK_TYPE])}
            name={`${elementPath}.${BLOCK_TYPE}`}
            value={block[BLOCK_TYPE]}
            id="blockTypeSelect"
            options={blocksOptions}
            onSelect={handleSelectBlock}
            placeholder={intl.formatMessage(messages.blockPlaceholder)}
            customLabelStyles={customLabelStyles}
            {...restFormikProps}
          />
        </InputContainer>
      </AccordionDetails>
    </AccordionPanel>
  );
};

PageTemplateBlock.propTypes = {
  block: PropTypes.object.isRequired,
  blocksOptions: PropTypes.array.isRequired,
  index: PropTypes.number.isRequired,
  handleChange: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  removeBlock: PropTypes.func.isRequired,
  draggableIcon: PropTypes.element.isRequired,
  autoFocus: PropTypes.bool.isRequired,
};
