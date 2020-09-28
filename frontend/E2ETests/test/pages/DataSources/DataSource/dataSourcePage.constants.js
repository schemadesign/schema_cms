import { CSV_FILE } from '../Create/createDatasource.constants';

export const DATA_SOURCE_MAIN_PAGE = 'datasource';
export const SOURCE_LABEL = 'Source';
export const ITEMS_LABEL = 'Items';
export const FIELDS_LABEL = 'Fields';
export const FILTERS_LABEL = 'Filters';
export const TAGS_LABEL = 'Tags';

const DATA_SOURCE_CREATION_DATE = 'a few seconds ago';
export const DATA_SOURCE_CREATOR_NAME = {
  invitedAdmin: `${process.env.SCHEMA_ADMIN_FIRST_NAME_INVITED} ${process.env.SCHEMA_ADMIN_LAST_NAME_INVITED}`,
  existingAdmin: `${process.env.SCHEMA_ADMIN_FIRST_NAME} ${process.env.SCHEMA_ADMIN_LAST_NAME}`,
};
const DATA_SOURCE_EMPTY_VALUE = '—';
export const DATA_SOURCE_TILE_VALUES = [
  DATA_SOURCE_CREATION_DATE,
  SOURCE_LABEL,
  ITEMS_LABEL,
  CSV_FILE.rowsAmount,
  FIELDS_LABEL,
  CSV_FILE.columnsAmount,
  FILTERS_LABEL,
  DATA_SOURCE_EMPTY_VALUE,
  TAGS_LABEL,
  DATA_SOURCE_EMPTY_VALUE,
];
