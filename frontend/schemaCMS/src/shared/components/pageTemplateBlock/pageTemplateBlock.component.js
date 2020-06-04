import React from 'react';
import PropTypes from 'prop-types';
import { Icons } from 'schemaUI';
import { useIntl } from 'react-intl';

import {
  customLabelStyles,
  Header,
  IconsContainer,
  InputContainer,
  customSelectStyles,
} from './pageTemplateBlock.styles';
import messages from './pageTemplateBlock.messages';
import { Select } from '../form/select';
import { BLOCK_TYPE, PAGE_TEMPLATES_BLOCKS } from '../../../modules/pageTemplates/pageTemplates.constants';
import { binStyles } from '../form/frequentComponents.styles';

const { EditIcon, BinIcon } = Icons;

export const PageTemplateBlock = ({
  block,
  index,
  setFieldValue,
  blocksOptions,
  removeBlock,
  draggableIcon,
  ...restFormikProps
}) => {
  const intl = useIntl();
  const elementPath = `${PAGE_TEMPLATES_BLOCKS}.${index}`;
  const handleSelectBlock = ({ value }) => setFieldValue(`${elementPath}.${BLOCK_TYPE}`, value);

  return (
    <Header>
      <IconsContainer>{draggableIcon}</IconsContainer>
      <InputContainer>
        <Select
          name={`${elementPath}.${BLOCK_TYPE}`}
          value={block[BLOCK_TYPE]}
          id="blockTypeSelect"
          options={blocksOptions}
          onSelect={handleSelectBlock}
          placeholder={intl.formatMessage(messages.blockPlaceholder)}
          customLabelStyles={customLabelStyles}
          customStyles={customSelectStyles}
          centerIcon
          {...restFormikProps}
        />
      </InputContainer>
      <IconsContainer>
        <EditIcon />
        <BinIcon id={`removeBlock-${index}`} customStyles={binStyles} onClick={() => removeBlock(index)} />
      </IconsContainer>
    </Header>
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
