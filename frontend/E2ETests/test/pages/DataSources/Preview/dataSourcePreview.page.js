import { createSelectors } from '../../../helpers/utils';
import { clickElement } from '../../../helpers/actions';
import { CSV_FILE } from '../Create/createDatasource.constants';
import {
  FIFTH_FIELD,
  FIRST_FIELD,
  FOURTH_FIELD,
  SECOND_FIELD,
  SEVENTH_FIELD,
  SIXTH_FIELD,
  THIRD_FIELD,
  UPPER_CASED,
} from './dataSourcePreview.constants';

const singleSelectors = {
  leftArrowBtn: '#previewLeftBtn',
  rightArrowBtn: '#previewRightBtn',
  fieldsAmount: '#fieldsAmountLabel',
};

const multiSelectors = {
  columns: 'thead > tr > th',
  rows: 'tbody > tr',
  row: 'tbody > tr > td',
  fieldInfoRows: '#fieldInfoTable li span',
};

const waitForPreviewTableToRender = DataSourcePreview => () => {
  for (const column of DataSourcePreview.columns()) {
    column.waitForExist();
  }
  for (const row of DataSourcePreview.rows()) {
    row.waitForExist();
  }
};

const calculateAmountOfColumns = DataSourcePreview => () => DataSourcePreview.columns().length - 1;

const calculateAmountOfRows = DataSourcePreview => () => DataSourcePreview.rows().length;

const expectHeaderOfTableToMatchFile = () => (element, index) => expect(element).toHaveText(CSV_FILE.header[index]);

const expectRowsOfTableToMatchFile = () => (element, index) => expect(element).toHaveText(CSV_FILE.rows[index]);

const expectRowsOfTableToBeCased = () => (element, index, dataFormat) =>
  expect(element).toHaveText(
    dataFormat === UPPER_CASED ? CSV_FILE.upperCasedRows[index] : CSV_FILE.rows[index].toLowerCase()
  );

const expectPreviewTableToBeCased = DataSourcePreview => dataFormat => {
  DataSourcePreview.columns().forEach(expectHeaderOfTableToMatchFile);
  DataSourcePreview.row().forEach((element, index) =>
    expectRowsOfTableToBeCased(DataSourcePreview)(element, index, dataFormat)
  );
};

const expectPreviewTableToMatchFile = DataSourcePreview => () => {
  DataSourcePreview.columns().forEach(expectHeaderOfTableToMatchFile);
  DataSourcePreview.row().forEach(expectRowsOfTableToMatchFile);
};

const expectFieldInfoToMatchFile = DataSourcePreview => () => {
  const fieldsInfoPages = [
    FIRST_FIELD,
    SECOND_FIELD,
    THIRD_FIELD,
    FOURTH_FIELD,
    FIFTH_FIELD,
    SIXTH_FIELD,
    SEVENTH_FIELD,
  ];

  fieldsInfoPages.forEach((item, index) => {
    $(`#fieldInfo-${index + 1}`).waitForDisplayed();
    item.forEach((copy, index) => expect(DataSourcePreview.fieldInfoRows()[index]).toHaveText(copy));
    clickElement(DataSourcePreview.rightArrowBtn());
  });
};

const getFunctions = DataSourcePreview => ({
  waitForPreviewTableToRender: waitForPreviewTableToRender(DataSourcePreview),
  calculateAmountOfColumns: calculateAmountOfColumns(DataSourcePreview),
  calculateAmountOfRows: calculateAmountOfRows(DataSourcePreview),
  expectHeaderOfTableToMatchFile: expectHeaderOfTableToMatchFile(DataSourcePreview),
  expectRowsOfTableToMatchFile: expectRowsOfTableToMatchFile(DataSourcePreview),
  expectRowsOfTableToBeCased: expectRowsOfTableToBeCased(DataSourcePreview),
  expectPreviewTableToBeCased: expectPreviewTableToBeCased(DataSourcePreview),
  expectPreviewTableToMatchFile: expectPreviewTableToMatchFile(DataSourcePreview),
  expectFieldInfoToMatchFile: expectFieldInfoToMatchFile(DataSourcePreview),
});

const convertedSelectors = createSelectors([singleSelectors], [multiSelectors]);

export default {
  ...convertedSelectors,
  ...getFunctions(convertedSelectors),
};
