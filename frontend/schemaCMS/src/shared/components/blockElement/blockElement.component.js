import React from 'react';
import PropTypes from 'prop-types';
import { cond, pathEq, T } from 'ramda';
import { AccordionDetails, AccordionHeader, AccordionPanel, Icons } from 'schemaUI';

import { DetailsContainer, Header, Name, IconContainer } from './blockElement.styles';
import { IMAGE_TYPE } from '../../../modules/blockTemplates/blockTemplates.constants';
import { ImageElement } from './imageElement.component';
import { DefaultElement } from './defaultElement.component';

const { MinusIcon } = Icons;

export const BlockElement = props => {
  const { element } = props;
  const elementComponent = cond([[pathEq(['element', 'type'], IMAGE_TYPE), ImageElement], [T, DefaultElement]])(props);

  return (
    <AccordionPanel autoOpen>
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
