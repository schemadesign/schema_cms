import React from 'react';
import PropTypes from 'prop-types';
import { cond, pathEq, T } from 'ramda';
import { AccordionDetails, AccordionHeader, AccordionPanel, Icons } from 'schemaUI';
import { useIntl } from 'react-intl';

import { DetailsContainer, Header, IconContainer, customInputStyles } from './blockElement.styles';
import {
  IMAGE_TYPE,
  FILE_TYPE,
  INTERNAL_CONNECTION_TYPE,
  MARKDOWN_TYPE,
  OBSERVABLEHQ_TYPE,
  CUSTOM_ELEMENT_TYPE,
  EMBED_VIDEO_TYPE,
  STATE_TYPE,
} from '../../../modules/blockTemplates/blockTemplates.constants';
import { FileElement } from './fileElement.component';
import { InternalConnectionElement } from './internalConnectionElement.component';
import { DefaultElement } from './defaultElement.component';
import { MarkdownElement } from './markdownElement.component';
import { ObservableHQElement } from './observableHQElement.component';
import { CustomElement } from './customElement.component';
import { EmbedVideoElement } from './embedVideoElement.component';
import { TextInput } from '../form/inputs/textInput';
import { StateElement } from './stateElement.component';
import messages from './blockElement.messages';

const { MinusIcon, EditIcon } = Icons;

export const getElementComponent = props =>
  cond([
    [pathEq(['element', 'type'], IMAGE_TYPE), props => <FileElement {...props} accept=".png, .jpg, .jpeg, .gif" />],
    [pathEq(['element', 'type'], FILE_TYPE), FileElement],
    [pathEq(['element', 'type'], EMBED_VIDEO_TYPE), EmbedVideoElement],
    [pathEq(['element', 'type'], INTERNAL_CONNECTION_TYPE), InternalConnectionElement],
    [pathEq(['element', 'type'], MARKDOWN_TYPE), MarkdownElement],
    [pathEq(['element', 'type'], OBSERVABLEHQ_TYPE), ObservableHQElement],
    [pathEq(['element', 'type'], CUSTOM_ELEMENT_TYPE), CustomElement],
    [pathEq(['element', 'type'], STATE_TYPE), StateElement],
    [T, DefaultElement],
  ])(props);

export const BlockElement = props => {
  const { element, handleChange, index, blockPath, ...restFormikProps } = props;
  const elementPath = `${blockPath}.elements.${index}.name`;
  const intl = useIntl();

  return (
    <AccordionPanel index={element.id}>
      <AccordionHeader>
        <Header icons={2}>
          <IconContainer>
            <MinusIcon />
          </IconContainer>
          <TextInput
            name={elementPath}
            placeholder={intl.formatMessage(messages.elementNamePlaceholder)}
            onChange={handleChange}
            autoWidth
            fullWidth
            value={element.name}
            customInputStyles={customInputStyles}
            {...restFormikProps}
          />
          <IconContainer>
            <EditIcon />
          </IconContainer>
        </Header>
      </AccordionHeader>
      <AccordionDetails>
        <DetailsContainer>{getElementComponent(props)}</DetailsContainer>
      </AccordionDetails>
    </AccordionPanel>
  );
};

BlockElement.propTypes = {
  handleChange: PropTypes.func.isRequired,
  element: PropTypes.object.isRequired,
  blockPath: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
};
