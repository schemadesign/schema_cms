import { generateRandomString } from '../../../helpers/utils';

export const BLOCK_TEMPLATES = 'blockTemplates';
export const CUSTOM_ELEMENT = 'Custom Element';
export const CUSTOM = 'custom';
export const EXPAND_ELEMENTS = 'Expand Elements';

const MARKDOWN = 'Markdown';
const PLAIN_TEXT = 'Plain text';
const FILE = 'File';
const IMAGE = 'Image';
const CODE = 'Code';
const CONNECTION = 'Connection';
const INTERNAL_CONNECTION = 'Internal Connection';
const OBSERVABLE_HQ = 'ObservableHq';
const EMBED_VIDEO = 'Embed Video';
const STATE = 'State';
export const CUSTOM_ELEMENT_TYPES = [
  MARKDOWN,
  PLAIN_TEXT,
  FILE,
  IMAGE,
  CODE,
  CONNECTION,
  INTERNAL_CONNECTION,
  OBSERVABLE_HQ,
  EMBED_VIDEO,
  STATE,
];

export const STANDARD_ELEMENT_TYPES = [CUSTOM_ELEMENT, ...CUSTOM_ELEMENT_TYPES];

export const ELEMENT_TYPES = {
  markdown: 0,
  plainText: 1,
  file: 2,
  image: 3,
  code: 4,
  connection: 5,
  internalConnection: 6,
  observableHq: 7,
  embedVideo: 8,
  state: 9,
  customElement: 10,
};

export const BLOCK_TEMPLATE_STATES = {
  empty: '',
  valid: 'Markdown',
  tooLong: `${generateRandomString(101)}`,
  existing: 'Image',
};

export const BLOCK_TEMPLATE_ERRORS = {
  templateName: {
    tooLong: 'Block Template Name should have maximum 100 characters',
    empty: 'Required',
    existing: 'A block template with this name already exists  in project',
  },
  elementName: {
    tooLong: 'Element Name should have maximum 100 characters',
    empty: 'Required',
  },
};
