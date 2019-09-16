import * as Yup from 'yup';

export const FETCH_LIST_DELAY = 15 * 1000;

export const DATA_SOURCE_NAME = 'name';
export const DATA_SOURCE_FILE = 'file';
export const DATA_SOURCE_TYPE = 'type';
export const DATA_SOURCE_FILE_NAME = 'fileName';

export const SOURCE_TYPE_FILE = 'file';
export const SOURCE_TYPE_API = 'api';
export const SOURCE_TYPE_DATABASE = 'database';

export const STATUS_DRAFT = 'draft';
export const STATUS_ERROR = 'error';
export const STATUS_DONE = 'done';
export const STATUS_PROCESSING = 'processing';
export const STATUS_READY_FOR_PROCESSING = 'ready_for_processing';

export const INITIAL_STEP = 1;
export const FIELDS_STEP = 2;
export const DATA_WRANGLING_STEP = 3;
export const MAX_STEPS = 6;

export const IGNORED_FIELDS = ['file', 'metaData', 'errorLog', 'createdBy', 'status', 'created', 'id'];

export const DATA_SOURCE_SCHEMA = Yup.object().shape({
  [DATA_SOURCE_NAME]: Yup.string()
    .min(3, 'Data source Name should have at least 3 characters')
    .max(25, 'Data source Name should have maximum 50 characters')
    .required('Required'),
  [DATA_SOURCE_TYPE]: Yup.string().required('Required'),
  [DATA_SOURCE_FILE]: Yup.mixed(),
  [DATA_SOURCE_FILE_NAME]: Yup.string().required('Required'),
});
