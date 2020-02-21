import { generateRandomString } from '../utils/utils';

export const CREATE_DATASOURCE_PAGE_TITLE = 'Create Data Source - Schema CMS';
export const CSV_FILE = {
  valid: '../FileImportGraph.csv',
  invalid: '',
  columnsAmount: '7',
  rowsAmount: '6',
  displayedRowsAmount: '5',
  header: ['#', 'text', 'date', 'bool', 'url', 'integer', 'float', 'percentile'],
  rows: [
    '1',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    '2020-03-01',
    'true',
    'https://images-na.ssl-images-amazon.com/images/M/MV5BMTYwOTEwNjAzMl5BMl5BanBnXkFtZTcwODc5MTUwMw@@.jpg',
    '1528',
    '23%',
    '2.5',
    '2',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    '1980-02-03',
    'false',
    'https://images-na.ssl-images-amazon.com/images/M/MV5BMjM2Nzg4MzkwOF5BMl5BanBnXkFtZTgwNzA0OTE3NjE@.jpg',
    '12',
    '3.8',
    '100%',
    '3',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    '1991-04-06',
    'true',
    'https://images-na.ssl-images-amazon.com/images/M/MV5BNzU3NDg4NTAyNV5BMl5BanBnXkFtZTcwOTg2ODg1Mg@@.jpg',
    '19827384',
    '456.02',
    '80%',
    '4',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    '2005-03-07',
    'https://images-na.ssl-images-amazon.com/images/M/MV5BMjE2NzU1NTk2MV5BMl5BanBnXkFtZTgwMjIwMzcxMTE@.jpg',
    '1',
    '0.5',
    '1%',
    '5',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    '2013-10-10',
    'true',
    'https://images-na.ssl-images-amazon.com/images/M/MV5BMjI5OTYzNjI0Ml5BMl5BanBnXkFtZTcwMzM1NDA1OQ@@.jpg',
    '-1',
    '0.05',
    '13%',
    '5',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    '2018-05-04',
    'false',
    'https://images-na.ssl-images-amazon.com/images/M/MV5BMTU2NTYxODcwMF5BMl5BanBnXkFtZTcwNDk1NDY0Nw@@.jpg',
    '50',
    '14.256',
    '50%',
  ],
};
export const VALID = 'valid';
export const CREATE_DATASOURCE_VALID_TITLE = `Data source ${generateRandomString(8)}`;
export const CREATE_DATASOURCE_STATUS = ['Uploading file...', 'Processing meta data...', 'Processing data source...'];
export const CREATE_DATASOURCE_UPLOAD_FILE_ERROR = 'Uploading file failed';
export const CREATE_DATASOURCE_META_ERROR = 'Processing meta data failed';
export const SUCCESS = 'success';
export const FAIL = 'fail';
