import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { AccordionDetails, AccordionHeader, AccordionPanel, Icons } from 'schemaUI';

import { Header, IconsContainer, iconStyles, Type } from './blockPage.styles';
import { TextInput } from '../form/inputs/textInput';
import messages from './blockPage.messages';
import { PAGE_BLOCKS, BLOCK_NAME, BLOCK_TYPE } from '../../../modules/page/page.constants';

const { EditIcon, MinusIcon } = Icons;

export const BlockPage = ({ index, block, draggableIcon, handleChange, removeBlock, ...restFormikProps }) => {
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
      <AccordionDetails>elements</AccordionDetails>
    </AccordionPanel>
  );
};

BlockPage.propTypes = {
  index: PropTypes.number.isRequired,
  block: PropTypes.object.isRequired,
  draggableIcon: PropTypes.element.isRequired,
  removeBlock: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
};
