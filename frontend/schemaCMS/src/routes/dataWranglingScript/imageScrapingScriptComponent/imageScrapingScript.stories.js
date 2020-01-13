import React from 'react';
import { storiesOf } from '@storybook/react';
import { Theme } from 'schemaUI';

import { ImageScrapingScript } from './imageScrapingScript.component';

import { withTheme } from '../../../.storybook/decorators';
import { history, intl } from '../../../.storybook/helpers';
import mockScripts, { BLANK_CELLS } from '../../../modules/dataWranglingScripts/scripts.mock';

export const defaultProps = {
  // eslint-disable-next-line import/no-named-as-default-member
  dataWranglingScript: mockScripts[BLANK_CELLS],
  fetchDataWranglingScript: Function.prototype,
  fetchDataWranglingScripts: Function.prototype,
  fetchDataSource: Function.prototype,
  fieldsWithUrls: [],
  imageScrapingFields: [],
  dataWranglingScripts: [{ id: 0 }, { id: 1 }],
  setImageScrapingFields: Function.prototype,
  customScripts: [],
  intl,
  history,
  match: {
    path: '/',
    params: {
      scriptId: '1',
      dataSourceId: '1',
    },
  },
  isAdmin: false,
};

export const editorProps = {
  ...defaultProps,
  isAdmin: false,
};

storiesOf('Data Wrangling Script|ImageScrapingScript', module)
  .addDecorator(withTheme())
  .add('Default (admin)', () => <ImageScrapingScript {...defaultProps} />);

storiesOf('Data Wrangling Script|ImageScrapingScript', module)
  .addDecorator(withTheme(Theme.light))
  .add('Default (editor)', () => <ImageScrapingScript {...editorProps} />);
