/* eslint-disable max-len */
import { defineMessages } from 'react-intl';
import {
  JOB_STATE_SUCCESS,
  JOB_STATE_PROCESSING,
  JOB_STATE_PENDING,
  JOB_STATE_FAILURE,
} from '../../../modules/job/job.constants';

export default defineMessages({
  title: {
    id: 'dataSource.jobList.title',
    defaultMessage: 'Past Versions',
  },
  subTitle: {
    id: 'dataSource.jobList.subTitle',
    defaultMessage: 'Source',
  },
  cancel: {
    id: 'dataSource.jobList.cancel',
    defaultMessage: 'Cancel',
  },
  revert: {
    id: 'dataSource.jobList.revert',
    defaultMessage: 'Revert',
  },
  active: {
    id: 'dataSource.jobList.active',
    defaultMessage: ' (Active)',
  },
  [JOB_STATE_SUCCESS]: {
    id: 'dataSource.jobList.success',
    defaultMessage: 'Success',
  },
  [JOB_STATE_PROCESSING]: {
    id: 'dataSource.jobList.processing',
    defaultMessage: 'Processing',
  },
  [JOB_STATE_PENDING]: {
    id: 'dataSource.jobList.pending',
    defaultMessage: 'Pending',
  },
  [JOB_STATE_FAILURE]: {
    id: 'dataSource.jobList.failure',
    defaultMessage: 'Failed',
  },
  steps: {
    id: 'dataSource.jobList.steps',
    defaultMessage: '{length} {length, plural,one {Step} other {Steps}}',
  },
  originalFile: {
    id: 'dataSource.jobList.originalFile',
    defaultMessage: 'Original file',
  },
});
