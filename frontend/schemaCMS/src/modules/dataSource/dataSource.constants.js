import * as Yup from 'yup';
import { defaultTo } from 'ramda';

export const FETCH_LIST_DELAY = 5 * 1000;

export const DATA_SOURCE_FORM = 'data_source_form';
export const DATA_SOURCE_NAME = 'name';
export const DATA_SOURCE_FILE = 'file';
export const DATA_SOURCE_TYPE = 'type';
export const DATA_SOURCE_RUN_LAST_JOB = 'runLastJob';

export const SOURCE_TYPE_FILE = 'file';
export const SOURCE_TYPE_API = 'api';
export const SOURCE_TYPE_DATABASE = 'database';

export const SOURCE_PAGE = 'source';
export const PREVIEW_PAGE = 'preview';
export const STEPS_PAGE = 'steps';
export const RESULT_PAGE = 'result';
export const FILTERS_PAGE = 'filters';
export const TAGS_PAGE = 'tag';
export const METADATA_PAGE = 'metadata';
export const STATES_PAGE = 'state';

export const META_PENDING = 'pending';
export const META_PROCESSING = 'processing';
export const META_FAILED = 'failed';
export const META_SUCCESS = 'success';

export const DATA_SOURCE_FIELDS = ['fileName', 'type', 'name'];

const FILE_SIZE = 900000000;

export const DATA_SOURCE_SCHEMA = Yup.object().shape({
  [DATA_SOURCE_NAME]: Yup.string()
    .trim()
    .min(3, 'Data source Name should have at least 3 characters')
    .max(25, 'Data source Name should have maximum 25 characters')
    .required('Required'),
  [DATA_SOURCE_TYPE]: Yup.string().required('Required'),
  [DATA_SOURCE_FILE]: Yup.mixed()
    .test('fileSize', 'File Size is too large (max 900MB)', (value = {}) => defaultTo(0, value.size) <= FILE_SIZE)
    .test('fileName', "File Name shouldn't be longer than 100 characters.", ({ name = '' } = {}) => name.length <= 100),
});
