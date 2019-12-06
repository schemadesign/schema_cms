import React from 'react';
import { storiesOf } from '@storybook/react';
import { Theme } from 'schemaUI';

import { DataWranglingDefaultScript } from './dataWranglingDefaultScript.component';

import { withTheme } from '../../../.storybook/decorators';
import mockScripts, { BLANK_CELLS } from '../../../modules/dataWranglingScripts/scripts.mock';

export const defaultProps = {
  // eslint-disable-next-line import/no-named-as-default-member
  dataWranglingScript: mockScripts[BLANK_CELLS],
  fetchDataWranglingScript: Function.prototype,
  imageScrapingFields: [],
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
    path: '/',
    params: {
      scriptId: '1',
    },
  },
};

export const editorProps = {
  ...defaultProps,
  isAdmin: false,
};

storiesOf('DataWranglingDefaultScript', module)
  .addDecorator(withTheme())
  .add('admin', () => <DataWranglingDefaultScript {...defaultProps} />);

storiesOf('DataWranglingDefaultScript', module)
  .addDecorator(withTheme(Theme.light))
  .add('editor', () => <DataWranglingDefaultScript {...editorProps} />);
