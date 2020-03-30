import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { useTheme } from 'styled-components';
import { Accordion, AccordionDetails, AccordionHeader, AccordionPanel, Icons } from 'schemaUI';

import { getCustomIconStyles, Header, IconsContainer, iconStyles, Type } from './pageBlock.styles';
import { TextInput } from '../form/inputs/textInput';
import messages from './pageBlock.messages';
import { BlockElement } from '../blockElement';
import { BLOCK_ELEMENTS, BLOCK_NAME, BLOCK_TYPE, PAGE_BLOCKS } from '../../../modules/page/page.constants';

const { EditIcon, MinusIcon } = Icons;

export const PageBlock = ({ index, block, draggableIcon, handleChange, removeBlock, ...restFormikProps }) => {
  const intl = useIntl();
  const theme = useTheme();
  const blockPath = `${PAGE_BLOCKS}.${index}`;
  const blockName = `${blockPath}.${BLOCK_NAME}`;

  return (
    <AccordionPanel>
      <AccordionHeader>
        <Header>
          <IconsContainer>{draggableIcon}</IconsContainer>
          <TextInput
            name={blockName}
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
        <Accordion customIconStyles={getCustomIconStyles(theme)}>
          {block[BLOCK_ELEMENTS].map((element, index) => (
            <BlockElement
              key={index}
              index={index}
              blockPath={blockPath}
              element={element}
              handleChange={handleChange}
              {...restFormikProps}
            />
          ))}
        </Accordion>
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
