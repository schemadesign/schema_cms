import * as Yup from 'yup';

export const JOB_DETAIL_FORM = 'job_detail_form';

export const JOB_OPTION = 'job_option_revert';

export const JOB_STATE_PENDING = 'pending';
export const JOB_STATE_PROCESSING = 'processing';
export const JOB_STATE_SUCCESS = 'success';
export const JOB_STATE_FAILURE = 'failed';

export const JOB_ID = 'pk';
export const DATASOURCE_ID = 'datasource';
export const STEPS = 'steps';
export const JOB_STATE = 'jobState';
export const RESULT = 'result';
export const ERROR = 'error';
export const DESCRIPTION = 'description';

export const INITIAL_VALUES = {
  [JOB_ID]: null,
  [DATASOURCE_ID]: null,
  [STEPS]: [],
  [JOB_STATE]: null,
  [RESULT]: '',
  [DESCRIPTION]: '',
};

export const JOB_DETAIL_SCHEMA = Yup.object().shape({
  [DESCRIPTION]: Yup.string().max(1000, 'Description should have maximum 1000 characters'),
});
