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
  fetchDataSource: Function.prototype,
  setImageScrapingFields: Function.prototype,
  fetchDataWranglingScript: Function.prototype,
  isAdmin: true,
  history,
  intl,
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
};

storiesOf('Data Wrangling Script|ImageScrapingScript', module)
  .addDecorator(withTheme())
  .add('Default (admin)', () => <ImageScrapingScript {...defaultProps} />);

storiesOf('Data Wrangling Script|ImageScrapingScript', module)
  .addDecorator(withTheme(Theme.light))
  .add('Default (editor)', () => <ImageScrapingScript {...editorProps} />);
