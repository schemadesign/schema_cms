import React from 'react';
import { storiesOf } from '@storybook/react';
import { Theme } from 'schemaUI';

import { DataWranglingDefaultScript } from './dataWranglingDefaultScript.component';

import { withTheme } from '../../../.storybook/decorators';
import { history, intl } from '../../../.storybook/helpers';
import mockScripts, { BLANK_CELLS } from '../../../modules/dataWranglingScripts/scripts.mock';

export const defaultProps = {
  // eslint-disable-next-line import/no-named-as-default-member
  dataWranglingScript: mockScripts[BLANK_CELLS],
  fetchDataWranglingScript: Function.prototype,
  imageScrapingFields: [],
  setImageScrapingFields: Function.prototype,
  isAdmin: true,
  history,
  intl,
  match: {},
};

export const editorProps = {
  ...defaultProps,
  isAdmin: false,
};

storiesOf('Data Wrangling Script|DataWranglingDefaultScript', module)
  .addDecorator(withTheme())
  .add('Default (admin)', () => <DataWranglingDefaultScript {...defaultProps} />);

storiesOf('Data Wrangling Script|DataWranglingDefaultScript', module)
  .addDecorator(withTheme(Theme.light))
  .add('Default (editor)', () => <DataWranglingDefaultScript {...editorProps} />);
