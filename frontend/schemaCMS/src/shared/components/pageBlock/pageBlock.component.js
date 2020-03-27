import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { AccordionDetails, AccordionHeader, AccordionPanel, Icons } from 'schemaUI';

import { Header, IconsContainer, iconStyles, Type } from './pageBlock.styles';
import { TextInput } from '../form/inputs/textInput';
import messages from './pageBlock.messages';
import { BlockElement } from '../blockElement';
import { PAGE_BLOCKS, BLOCK_NAME, BLOCK_TYPE, BLOCK_ELEMENTS } from '../../../modules/page/page.constants';

const { EditIcon, MinusIcon } = Icons;

export const PageBlock = ({ index, block, draggableIcon, handleChange, removeBlock, ...restFormikProps }) => {
  const intl = useIntl();
  const elementPath = `${PAGE_BLOCKS}.${index}`;

  return (
    <AccordionPanel>
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
            {...restFormikProps}
          />
          <IconsContainer>
            <EditIcon />
            <MinusIcon id={`removeBlock-${index}`} customStyles={iconStyles} onClick={() => removeBlock(index)} />
          </IconsContainer>
        </Header>
        <Type>{block[BLOCK_TYPE]}</Type>
      </AccordionHeader>
      <AccordionDetails>
        {block[BLOCK_ELEMENTS].map((element, index) => (
          <BlockElement key={index} element={element} />
        ))}
      </AccordionDetails>
    </AccordionPanel>
  );
};

PageBlock.propTypes = {
  index: PropTypes.number.isRequired,
  block: PropTypes.object.isRequired,
  draggableIcon: PropTypes.element.isRequired,
  removeBlock: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
};
