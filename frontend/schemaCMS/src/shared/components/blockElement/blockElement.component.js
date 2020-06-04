import React from 'react';
import PropTypes from 'prop-types';
import { cond, pathEq, T } from 'ramda';
import { AccordionDetails, AccordionHeader, AccordionPanel, Icons } from 'schemaUI';

import { DetailsContainer, Header, Name, IconContainer } from './blockElement.styles';
import {
  IMAGE_TYPE,
  FILE_TYPE,
  INTERNAL_CONNECTION_TYPE,
  MARKDOWN_TYPE,
  OBSERVABLEHQ_TYPE,
  CUSTOM_ELEMENT_TYPE,
} from '../../../modules/blockTemplates/blockTemplates.constants';
import { FileElement } from './fileElement.component';
import { InternalConnectionElement } from './internalConnectionElement.component';
import { DefaultElement } from './defaultElement.component';
import { MarkdownElement } from './markdownElement.component';
import { ObservableHQElement } from './observableHQElement.component';
import { CustomElement } from './customElement.component';

const { MinusIcon } = Icons;

export const getElementComponent = props =>
  cond([
    [pathEq(['element', 'type'], IMAGE_TYPE), props => <FileElement {...props} accept=".png, .jpg, .jpeg, .gif" />],
    [pathEq(['element', 'type'], FILE_TYPE), FileElement],
    [pathEq(['element', 'type'], INTERNAL_CONNECTION_TYPE), InternalConnectionElement],
    [pathEq(['element', 'type'], MARKDOWN_TYPE), MarkdownElement],
    [pathEq(['element', 'type'], OBSERVABLEHQ_TYPE), ObservableHQElement],
    [pathEq(['element', 'type'], CUSTOM_ELEMENT_TYPE), CustomElement],
    [T, DefaultElement],
  ])(props);

export const BlockElement = props => {
  const { element } = props;

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
        <DetailsContainer>{getElementComponent(props)}</DetailsContainer>
      </AccordionDetails>
    </AccordionPanel>
  );
};

BlockElement.propTypes = {
  element: PropTypes.object.isRequired,
};
