import React from 'react';
import PropTypes from 'prop-types';
import { cond, pathEq, T } from 'ramda';
import { AccordionDetails, AccordionHeader, AccordionPanel, Icons } from 'schemaUI';

import { DetailsContainer, Header, Name, IconContainer } from './blockElement.styles';
import { ELEMENT_VALUE, IMAGE_TYPE, STACK_TYPE } from '../../../modules/blockTemplates/blockTemplates.constants';
import { ImageElement } from './imageElement.component';
import { DefaultElement } from './defaultElement.component';
import { BlockStackElement } from './blockStackElement.component';
import { BLOCK_ELEMENTS } from '../../../modules/page/page.constants';

const { MinusIcon } = Icons;

export const BlockElement = props => {
  const { element, blockPath, index } = props;
  const formikFieldPath = `${blockPath}.${BLOCK_ELEMENTS}.${index}.${ELEMENT_VALUE}`;
  const elementComponent = cond([
    [pathEq(['element', 'type'], IMAGE_TYPE), ImageElement],
    [pathEq(['element', 'type'], STACK_TYPE), BlockStackElement],
    [T, DefaultElement],
  ])({ ...props, formikFieldPath });

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
  blockPath: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
};
