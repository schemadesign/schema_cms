/* eslint-disable max-len */
import { defineMessages } from 'react-intl';
import { SCRIPT_TYPES } from '../../../modules/dataWranglingScripts/dataWranglingScripts.constants';

const { CUSTOM, DEFAULT, UPLOADED } = SCRIPT_TYPES;

export default defineMessages({
  pageTitle: {
    id: 'dataSource.dataWranglingScripts.pageTitle',
    defaultMessage: 'Data Wrangling',
  },
  subTitle: {
    id: 'dataSource.dataWranglingScripts.subTitle',
    defaultMessage: 'Data Wrangling',
  },
  steps: {
    id: 'dataSource.dataWranglingScripts.steps',
    defaultMessage: '{length} {length, plural,one {Step} other {Steps}}',
  },
  errorOnUploading: {
    id: 'dataSource.dataWranglingScripts.errorOnUploading',
    defaultMessage: 'Error on uploading a file.',
  },
  errorTooLongName: {
    id: 'dataSource.dataWranglingScripts.errorOnUploading',
    defaultMessage: 'Script name should have maximum 50 characters.',
  },
  errorJobFailed: {
    id: 'dataSource.dataWranglingScripts.errorOnUploading',
    defaultMessage: 'An error happened while trying to process the scripts.',
  },
  save: {
    id: 'dataSource.dataWranglingScripts.save',
    defaultMessage: 'Save',
  },
  ongoingProcess: {
    id: 'dataSource.dataWranglingScripts.ongoingProcess',
    defaultMessage: 'Another job is running.',
  },
  [CUSTOM]: {
    id: `dataSource.dataWranglingScripts.${CUSTOM}`,
    defaultMessage: 'Custom',
  },
  [DEFAULT]: {
    id: `dataSource.dataWranglingScripts.${DEFAULT}`,
    defaultMessage: 'Default',
  },
  [UPLOADED]: {
    id: `dataSource.dataWranglingScripts.${UPLOADED}`,
    defaultMessage: 'Uploaded',
  },
});
