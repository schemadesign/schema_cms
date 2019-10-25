/* eslint-disable max-len */
import { defineMessages } from 'react-intl';
import {
  JOB_ID,
  JOB_STATE,
  JOB_STATE_FAILURE,
  JOB_STATE_PENDING,
  JOB_STATE_PROCESSING,
  JOB_STATE_SUCCESS,
} from '../../modules/job/job.constants';

export default defineMessages({
  descriptionLabel: {
    id: 'jobDetail.descriptionLabel',
    defaultMessage: 'Job description',
  },
  [JOB_ID]: {
    id: 'jobDetail.jobId',
    defaultMessage: 'Job Id',
  },
  [JOB_STATE]: {
    id: 'jobDetail.jobState',
    defaultMessage: 'Job status',
  },
  [JOB_STATE_FAILURE]: {
    id: 'jobDetail.jobStateFailure',
    defaultMessage: 'Failed',
  },
  [JOB_STATE_PENDING]: {
    id: 'jobDetail.jobStatePending',
    defaultMessage: 'Pending',
  },
  [JOB_STATE_PROCESSING]: {
    id: 'jobDetail.jobStateProcessing',
    defaultMessage: 'Processing',
  },
  [JOB_STATE_SUCCESS]: {
    id: 'jobDetail.jobStateSuccess',
    defaultMessage: 'Success',
  },
});
