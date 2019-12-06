import React from 'react';
import { storiesOf } from '@storybook/react';
import { Theme } from 'schemaUI';

import { ImageScrapingScript } from './imageScrapingScript.component';

import { withTheme } from '../../../.storybook/decorators';
import mockScripts, { BLANK_CELLS } from '../../../modules/dataWranglingScripts/scripts.mock';

export const defaultProps = {
  // eslint-disable-next-line import/no-named-as-default-member
  dataWranglingScript: mockScripts[BLANK_CELLS],
  fetchDataSource: Function.prototype,
  setImageScrapingFields: Function.prototype,
  intl: {
    formatMessage: ({ defaultMessage }) => defaultMessage,
  },
  history: {
    push: Function.prototype,
    goBack: Function.prototype,
  },
  isAdmin: true,
  match: {
    params: {
      projectId: '1',
      dataSourceId: '1',
      scriptId: '1',
      step: '3',
    },
  },
  fieldNames: [],
  imageScrapingFields: [],
};

export const editorProps = {
  ...defaultProps,
  isAdmin: false,
}

storiesOf('ImageScrapingScript', module)
  .addDecorator(withTheme())
  .add('admin', () => <ImageScrapingScript {...defaultProps} />);

storiesOf('ImageScrapingScript', module)
  .addDecorator(withTheme(Theme.light))
  .add('editor', () => <ImageScrapingScript {...editorProps} />);
