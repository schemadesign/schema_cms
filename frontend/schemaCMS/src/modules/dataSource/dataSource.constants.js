import * as Yup from 'yup';
import { defaultTo } from 'ramda';

export const FETCH_LIST_DELAY = 5 * 1000;

export const DATA_SOURCE_NAME = 'name';
export const DATA_SOURCE_FILE = 'file';
export const DATA_SOURCE_TYPE = 'type';

export const SOURCE_TYPE_FILE = 'file';
export const SOURCE_TYPE_API = 'api';
export const SOURCE_TYPE_DATABASE = 'database';

export const INITIAL_STEP = 1;
export const FIELDS_STEP = 2;
export const DATA_WRANGLING_STEP = 3;
export const DATA_WRANGLING_RESULT_STEP = 4;
export const MAX_STEPS = 6;

export const IGNORED_FIELDS = ['file', 'metaData', 'errorLog', 'createdBy', 'status', 'created', 'id'];

const FILE_SIZE = 300000000;

export const DATA_SOURCE_SCHEMA = Yup.object().shape({
  [DATA_SOURCE_NAME]: Yup.string()
    .min(3, 'Data source Name should have at least 3 characters')
    .max(25, 'Data source Name should have maximum 25 characters')
    .required('Required'),
  [DATA_SOURCE_TYPE]: Yup.string().required('Required'),
  [DATA_SOURCE_FILE]: Yup.mixed()
    .required('File is required')
    .test('fileSize', 'File Size is too large (max 300MB)', (value = {}) => defaultTo(0, value.size) <= FILE_SIZE)
    .test('fileName', "File Name shouldn't be longer than 100 characters.", (fileName = '') => fileName.length > 100),
});
