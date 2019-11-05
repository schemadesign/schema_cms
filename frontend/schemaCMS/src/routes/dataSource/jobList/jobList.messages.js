/* eslint-disable max-len */
import { defineMessages } from 'react-intl';
import {
  JOB_STATE_SUCCESS,
  JOB_STATE_PROCESSING,
  JOB_STATE_PENDING,
  JOB_STATE_FAILURE,
} from '../../../modules/job/job.constants';

export default defineMessages({
  cancel: {
    id: 'jobList.cancel',
    defaultMessage: 'Cancel',
  },
  revert: {
    id: 'jobList.revert',
    defaultMessage: 'Revert',
  },
  [JOB_STATE_SUCCESS]: {
    id: 'jobList.success',
    defaultMessage: 'Success',
  },
  [JOB_STATE_PROCESSING]: {
    id: 'jobList.processing',
    defaultMessage: 'Processing',
  },
  [JOB_STATE_PENDING]: {
    id: 'jobList.pending',
    defaultMessage: 'Pending',
  },
  [JOB_STATE_FAILURE]: {
    id: 'jobList.failure',
    defaultMessage: 'Failed',
  },
});
