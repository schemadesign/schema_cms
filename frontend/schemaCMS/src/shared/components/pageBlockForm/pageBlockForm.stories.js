import React from 'react';
import { storiesOf } from '@storybook/react';

import { PageBlockForm } from './pageBlockForm.component';
import { withTheme } from '../../../.storybook/decorators';
import { intl } from '../../../.storybook/helpers';
import {
  IMAGE_TYPE,
  MARKDOWN_TYPE,
  NONE,
  EMBED_TYPE,
  CODE_TYPE,
  TEXT_TYPE,
} from '../../../modules/pageBlock/pageBlock.constants';

export const defaultProps = {
  handleChange: Function.prototype,
  setFieldValue: Function.prototype,
  intl,
};

export const noneProps = {
  ...defaultProps,
  values: {
    name: '',
    type: NONE,
  },
};

export const embedProps = {
  ...defaultProps,
  values: {
    name: 'embed name',
    content: 'embed content',
    type: EMBED_TYPE,
  },
};

export const codeProps = {
  ...defaultProps,
  values: {
    name: 'code name',
    content: 'code content',
    type: CODE_TYPE,
  },
};

export const markdownProps = {
  ...defaultProps,
  values: {
    name: 'markdown name',
    content: 'markdown content',
    type: MARKDOWN_TYPE,
  },
};

export const textProps = {
  ...defaultProps,
  values: {
    name: 'text name',
    content: 'text content',
    type: TEXT_TYPE,
  },
};

export const imageProps = {
  ...defaultProps,
  values: {
    name: 'name',
    image: [{ file: 'file', id: 1 }],
    imageNames: [{ imageName: 'imageName.png', id: 1 }],
    type: IMAGE_TYPE,
  },
};

export const multipleImages = {
  ...defaultProps,
  values: {
    name: 'name',
    image: [{ file: 'file', id: 1 }, { file: 'file', id: 2 }],
    imageNames: [{ imageName: 'imageName.png', id: 1 }, { imageName: 'imageName.png', id: 2 }],
    type: IMAGE_TYPE,
  },
};

storiesOf('Shared Components|PageBlockForm', module)
  .addDecorator(withTheme())
  .add('None type', () => <PageBlockForm {...noneProps} />)
  .add('Markdown type', () => <PageBlockForm {...markdownProps} />)
  .add('Embed type', () => <PageBlockForm {...embedProps} />)
  .add('Code type', () => <PageBlockForm {...codeProps} />)
  .add('Image type', () => <PageBlockForm {...imageProps} />)
  .add('Multiple images type', () => <PageBlockForm {...multipleImages} />)
  .add('Text type', () => <PageBlockForm {...textProps} />);
