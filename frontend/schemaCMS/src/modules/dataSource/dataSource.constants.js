import * as Yup from 'yup';

export const UPDATE_DATA_SOURCE_FORM = 'update_data_source_form';

export const DATA_SOURCE_NAME = 'name';
export const DATA_SOURCE_FILE = 'file';
export const DATA_SOURCE_TYPE = 'type';

export const SOURCE_TYPE_FILE = 'file';
export const SOURCE_TYPE_API = 'api';
export const SOURCE_TYPE_DATABASE = 'database';

export const STATUS_DRAFT = 'draft';
export const STATUS_ERROR = 'error';
export const STATUS_DONE = 'done';
export const STATUS_PROCESSING = 'processing';

export const INITIAL_STEP = 1;
export const FIELDS_STEP = 2;
export const MAX_STEPS = 6;

export const IGNORED_FIELDS = ['file', 'metaData', 'fileName'];

export const DATA_SOURCE_SCHEMA = Yup.object().shape({
  [DATA_SOURCE_NAME]: Yup.string()
    .min(3, 'Data source Name should have at least 3 characters')
    .max(50, 'Data source Name should have maximum 50 characters')
    .required('Required'),
  [DATA_SOURCE_TYPE]: Yup.string().required('Required'),
  [DATA_SOURCE_FILE]: Yup.mixed().required('Required'),
});
