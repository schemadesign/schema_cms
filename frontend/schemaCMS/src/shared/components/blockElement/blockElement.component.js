import React from 'react';
import PropTypes from 'prop-types';
import { cond, pathEq, T } from 'ramda';
import { AccordionDetails, AccordionHeader, AccordionPanel, Icons } from 'schemaUI';

import { DetailsContainer, Header, Name, IconContainer } from './blockElement.styles';
import {
  IMAGE_TYPE,
  INTERNAL_CONNECTION_TYPE,
  MARKDOWN_TYPE,
} from '../../../modules/blockTemplates/blockTemplates.constants';
import { ImageElement } from './imageElement.component';
import { InternalConnectionElement } from './internalConnectionElement.component';
import { DefaultElement } from './defaultElement.component';
import { MarkdownElement } from './markdownElement.component';

const { MinusIcon } = Icons;

export const BlockElement = props => {
  const { element } = props;
  const elementComponent = cond([
    [pathEq(['element', 'type'], IMAGE_TYPE), ImageElement],
    [pathEq(['element', 'type'], INTERNAL_CONNECTION_TYPE), InternalConnectionElement],
    [pathEq(['element', 'type'], MARKDOWN_TYPE), MarkdownElement],
    [T, DefaultElement],
  ])(props);

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
