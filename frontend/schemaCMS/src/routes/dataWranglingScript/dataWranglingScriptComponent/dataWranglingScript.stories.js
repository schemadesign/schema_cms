import React from 'react';
import { storiesOf } from '@storybook/react';
import { Theme } from 'schemaUI';

import { DataWranglingScript } from './dataWranglingScript.component';

import { withTheme } from '../../../.storybook/decorators';
import mockScripts, { BLANK_CELLS } from '../../../modules/dataWranglingScripts/scripts.mock';

export const defaultProps = {
  // eslint-disable-next-line import/no-named-as-default-member
  dataWranglingScript: mockScripts[BLANK_CELLS],
  fetchDataWranglingScript: Function.prototype,
  intl: {
    formatMessage: ({ defaultMessage }) => defaultMessage,
  },
  history: {
    push: Function.prototype,
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

storiesOf('DataWranglingScript', module)
  .addDecorator(withTheme())
  .add('admin', () => <DataWranglingScript {...defaultProps} />);

storiesOf('DataWranglingScript', module)
  .addDecorator(withTheme(Theme.light))
  .add('editor', () => <DataWranglingScript {...editorProps} />);
