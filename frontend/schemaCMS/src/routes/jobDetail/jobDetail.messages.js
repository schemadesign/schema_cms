/* eslint-disable max-len */
import { defineMessages } from 'react-intl';
import {
  ERROR,
  JOB_ID,
  JOB_STATE,
  JOB_STATE_FAILURE,
  JOB_STATE_PENDING,
  JOB_STATE_PROCESSING,
  JOB_STATE_SUCCESS,
} from '../../modules/job/job.constants';

export default defineMessages({
  title: {
    id: 'jobDetail.title',
    defaultMessage: 'Job',
  },
  subTitle: {
    id: 'jobDetail.subTitle',
    defaultMessage: 'Details',
  },
  descriptionLabel: {
    id: 'jobDetail.descriptionLabel',
    defaultMessage: 'Job description',
  },
  preview: {
    id: 'jobDetail.preview',
    defaultMessage: 'Preview',
  },
  save: {
    id: 'jobDetail.save',
    defaultMessage: 'Save',
  },
  back: {
    id: 'jobDetail.back',
    defaultMessage: 'Back',
  },
  originalFile: {
    id: 'jobDetail.originalFile',
    defaultMessage: 'Download Original File',
  },
  resultFile: {
    id: 'jobDetail.resultFile',
    defaultMessage: 'Download Result File',
  },
  stepsTitle: {
    id: 'jobDetail.stepsTitle',
    defaultMessage: 'Steps:',
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
  [ERROR]: {
    id: `jobDetail.${ERROR}`,
    defaultMessage: 'Error',
  },
});
