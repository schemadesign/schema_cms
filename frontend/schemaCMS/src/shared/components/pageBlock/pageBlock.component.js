import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { useTheme } from 'styled-components';
import { Accordion, AccordionDetails, AccordionHeader, AccordionPanel, Icons } from 'schemaUI';

import { Header, IconsContainer, iconStyles, Type, getCustomIconStyles } from './pageBlock.styles';
import { TextInput } from '../form/inputs/textInput';
import messages from './pageBlock.messages';
import { BlockElement } from '../blockElement';
import { BLOCK_NAME, BLOCK_TYPE, BLOCK_ELEMENTS } from '../../../modules/page/page.constants';

const { EditIcon, MinusIcon } = Icons;

export const PageBlock = ({
  index,
  block,
  pagerUrlOptions,
  formikFieldPath,
  draggableIcon,
  handleChange,
  removeBlock,
  ...restFormikProps
}) => {
  const intl = useIntl();
  const theme = useTheme();
  const blockPath = `${formikFieldPath}.${index}`;
  const blockName = `${blockPath}.${BLOCK_NAME}`;

  return (
    <AccordionPanel autoOpen>
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
            {removeBlock ? (
              <MinusIcon id={blockPath} customStyles={iconStyles} onClick={() => removeBlock(index)} />
            ) : null}
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
              pagerUrlOptions={pagerUrlOptions}
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
  pagerUrlOptions: PropTypes.array.isRequired,
  draggableIcon: PropTypes.element,
  removeBlock: PropTypes.func,
  handleChange: PropTypes.func.isRequired,
  formikFieldPath: PropTypes.string.isRequired,
};
