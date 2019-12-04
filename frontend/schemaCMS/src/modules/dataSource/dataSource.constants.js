import * as Yup from 'yup';
import { defaultTo } from 'ramda';

export const FETCH_LIST_DELAY = 5 * 1000;

export const DATA_SOURCE_NAME = 'name';
export const DATA_SOURCE_FILE = 'file';
export const DATA_SOURCE_TYPE = 'type';

export const SOURCE_TYPE_FILE = 'file';
export const SOURCE_TYPE_API = 'api';
export const SOURCE_TYPE_DATABASE = 'database';

export const SOURCE_PAGE = 'source';
export const PREVIEW_PAGE = 'preview';
export const STEPS_PAGE = 'steps';
export const RESULT_PAGE = 'result';
export const FILTERS_PAGE = 'filters';
export const VIEWS_PAGE = 'views';

export const IGNORED_FIELDS = ['file', 'metaData', 'errorLog', 'createdBy', 'status', 'created', 'id'];

const FILE_SIZE = 300000000;

export const DATA_SOURCE_SCHEMA = Yup.object().shape({
  [DATA_SOURCE_NAME]: Yup.string()
    .trim()
    .min(3, 'Data source Name should have at least 3 characters')
    .max(25, 'Data source Name should have maximum 25 characters')
    .required('Required'),
  [DATA_SOURCE_TYPE]: Yup.string().required('Required'),
  [DATA_SOURCE_FILE]: Yup.mixed()
    .test('fileSize', 'File Size is too large (max 300MB)', (value = {}) => defaultTo(0, value.size) <= FILE_SIZE)
    .test('fileName', "File Name shouldn't be longer than 100 characters.", ({ name = '' } = {}) => name.length <= 100),
});
