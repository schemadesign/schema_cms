import React from 'react';
import { storiesOf } from '@storybook/react';
import Immutable from 'seamless-immutable';

import { withTheme } from '../../../.storybook/decorators';
import { history, intl } from '../../../.storybook/helpers';
import { DataWranglingScripts } from './dataWranglingScripts.component';
import { SCRIPT_TYPES } from '../../../modules/dataWranglingScripts/dataWranglingScripts.constants';
import { ROLES } from '../../../modules/userProfile/userProfile.constants';

const dataWranglingScripts = new Immutable([
  { id: 1, name: 'name 1', specs: {}, isPredefined: false, type: SCRIPT_TYPES.UPLOADED },
  { id: 2, name: 'name 2', specs: {}, isPredefined: true, type: SCRIPT_TYPES.DEFAULT },
  { id: 3, name: 'name 3', specs: { type: 'type' }, isPredefined: true, type: SCRIPT_TYPES.CUSTOM },
]);

export const defaultProps = {
  userRole: ROLES.ADMIN,
  dataWranglingScripts,
  checkedScripts: [dataWranglingScripts[0]],
  uncheckedScripts: [dataWranglingScripts[0], dataWranglingScripts[1]],
  dataSource: { metaData: {}, project: { id: '1' } },
  bindSubmitForm: Function.prototype,
  setScriptsList: Function.prototype,
  setCheckedScripts: Function.prototype,
  fetchDataWranglingScripts: () => Promise.resolve(),
  uploadScript: Function.prototype,
  imageScrapingFields: [],
  customScripts: [],
  sendUpdatedDataWranglingScript: Function.prototype,
  isAdmin: true,
  history,
  intl,
  match: {
    params: {
      dataSourceId: '1',
      projectId: '1',
      step: '3',
    },
    url: '/datasource/1/steps',
  },
};

export const multipleCheckedScripts = {
  ...defaultProps,
  checkedScripts: dataWranglingScripts,
  uncheckedScripts: [],
};

export const noStepsProps = {
  ...defaultProps,
  dataWranglingScripts: [],
};

storiesOf('Data Source|DataWranglingScripts', module)
  .addDecorator(withTheme())
  .add('No data', () => <DataWranglingScripts {...noStepsProps} />)
  .add('Default', () => <DataWranglingScripts {...defaultProps} />)
  .add('Multiple checked scripts', () => <DataWranglingScripts {...multipleCheckedScripts} />);
