import React from 'react';
import { cond, pathEq, T } from 'ramda';
import {
  CUSTOM_ELEMENT_TYPE,
  EMBED_VIDEO_TYPE,
  FILE_TYPE,
  IMAGE_TYPE,
  INTERNAL_CONNECTION_TYPE,
  MARKDOWN_TYPE,
  OBSERVABLEHQ_TYPE,
  STATE_TYPE,
} from '../../modules/blockTemplates/blockTemplates.constants';
import { FileElement } from '../components/blockElement/fileElement.component';
import { EmbedVideoElement } from '../components/blockElement/embedVideoElement.component';
import { InternalConnectionElement } from '../components/blockElement/internalConnectionElement.component';
import { MarkdownElement } from '../components/blockElement/markdownElement.component';
import { ObservableHQElement } from '../components/blockElement/observableHQElement.component';
// eslint-disable-next-line import/no-cycle
import { CustomElement } from '../components/blockElement/customElement.component';
import { StateElement } from '../components/blockElement/stateElement.component';
import { DefaultElement } from '../components/blockElement/defaultElement.component';

const getElementComponent = props =>
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

export default getElementComponent;
