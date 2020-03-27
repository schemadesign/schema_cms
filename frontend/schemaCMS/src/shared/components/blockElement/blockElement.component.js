import React from 'react';
import PropTypes from 'prop-types';
import { cond, pathEq, T } from 'ramda';
import { AccordionDetails, AccordionHeader, AccordionPanel, Icons } from 'schemaUI';
import { useTheme } from 'styled-components';

import { DetailsContainer, Header, Name, IconContainer, getCustomInputStyles } from './blockElement.styles';
import { ELEMENT_VALUE, IMAGE_TYPE, STACK_TYPE } from '../../../modules/blockTemplates/blockTemplates.constants';
import { TextInput } from '../form/inputs/textInput';
import { BLOCK_ELEMENTS } from '../../../modules/page/page.constants';

const { MinusIcon } = Icons;

const elementPropTypes = {
  element: PropTypes.object.isRequired,
  blockPath: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export const ImageElement = ({ element }) => element.type;
ImageElement.propTypes = elementPropTypes;
export const BlockStackElement = ({ element }) => element.type;
BlockStackElement.propTypes = elementPropTypes;
export const DefaultElement = ({ element, blockPath, index, handleChange, ...restFormikProps }) => (
  <TextInput
    name={`${blockPath}.${BLOCK_ELEMENTS}.${index}.${ELEMENT_VALUE}`}
    value={element.value}
    fullWidth
    customInputStyles={getCustomInputStyles(useTheme())}
    onChange={handleChange}
    {...restFormikProps}
  />
);
DefaultElement.propTypes = elementPropTypes;

export const BlockElement = props => {
  const elementComponent = cond([
    [pathEq(['element', 'type'], IMAGE_TYPE), ImageElement],
    [pathEq(['element', 'type'], STACK_TYPE), BlockStackElement],
    [T, DefaultElement],
  ])(props);
  const { element } = props;

  return (
    <AccordionPanel>
      <AccordionHeader>
        <Header>
          <IconContainer>
            <MinusIcon />
          </IconContainer>
          <Name>{element.name}</Name>
        </Header>
      </AccordionHeader>
      <AccordionDetails>
        <DetailsContainer>{elementComponent}</DetailsContainer>
      </AccordionDetails>
    </AccordionPanel>
  );
};

BlockElement.propTypes = {
  element: PropTypes.object.isRequired,
};
