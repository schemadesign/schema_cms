import * as Yup from 'yup';

export const CREATE_PROJECT_FORM = 'create_project_form';
export const PROJECT_TITLE = 'title';
export const PROJECT_DESCRIPTION = 'description';
export const PROJECT_OWNER = 'owner';
export const PROJECT_STATUS = 'status';
export const PROJECT_DOMAIN = 'domain';

export const PROJECT_STATUSES = {
  IN_PROGRESS: 'in_progress',
  DONE: 'done',
  HOLD: 'hold',
  PUBLISHED: 'published',
};

export const PROJECT_STATUSES_LIST = [
  PROJECT_STATUSES.IN_PROGRESS,
  PROJECT_STATUSES.DONE,
  PROJECT_STATUSES.HOLD,
  PROJECT_STATUSES.PUBLISHED,
];

export const INITIAL_VALUES = {
  [PROJECT_TITLE]: '',
  [PROJECT_DESCRIPTION]: '',
  [PROJECT_DOMAIN]: '',
  [PROJECT_STATUS]: PROJECT_STATUSES.IN_PROGRESS,
};

export const PROJECT_SCHEMA = Yup.object().shape({
  [PROJECT_TITLE]: Yup.string()
    .trim()
    .min(1, 'Project Name should have at least 1 characters')
    .max(50, 'Project Name should have maximum 50 characters')
    .required('Required'),
  [PROJECT_DESCRIPTION]: Yup.string()
    .trim()
    .max(150, 'Project Description should have maximum 150 characters')
    .required('Required'),
  [PROJECT_DOMAIN]: Yup.string()
    .url('Invalid URL')
    .notRequired(),
});
