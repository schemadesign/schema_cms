import Page from './page';
import SubHeaderComponent from './components/subHeader.component';
import { CSV_FILE } from '../constants/createDatasource.constants';
import {
  FIRST_FIELD,
  SECOND_FIELD,
  THIRD_FIELD,
  FOURTH_FIELD,
  FIFTH_FIELD,
  SIXTH_FIELD,
  SEVENTH_FIELD,
} from '../constants/dataSourcePreview.constants';
import { clickElement } from '../utils/utils';

class DataSourcePreviewPage extends Page {
  get SubHeader() {
    return SubHeaderComponent;
  }

  get leftArrowBtn() {
    return $('#previewLeftBtn');
  }

  get rightArrowBtn() {
    return $('#previewRightBtn');
  }

  get fieldsAmount() {
    return $('#fieldsAmountLabel');
  }

  get columns() {
    return $$('thead > tr > th');
  }

  get rows() {
    return $$('tbody > tr > td');
  }

  get fieldInfoRows() {
    return $$('#fieldInfoTable li span');
  }

  waitForPreviewTableToRender() {
    for (const column of this.columns) {
      column.waitForExist();
    }

    for (const row of this.rows) {
      row.waitForExist();
    }
  }

  calculateAmountOfColumns() {
    return $$('thead > tr > th').length - 1;
  }

  calculateAmountOfRows() {
    return $$('tbody > tr').length;
  }

  expectHeaderOfTableToMatchFile(element, index) {
    expect(element.getText()).to.equal(CSV_FILE.header[index]);
  }

  expectRowsOfTableToMatchFile(element, index) {
    expect(element.getText()).to.equal(CSV_FILE.rows[index]);
  }

  expectRowsOfTableToBeCased = (element, index) => dataFormat => {
    expect(element.getText()).to.equal(
      dataFormat === 'upper' ? CSV_FILE.rows[index].toUpperCase() : CSV_FILE.rows[index].toLowerCase()
    );
  };

  expectPreviewTableToBeCased(dataFormat) {
    this.columns.forEach(this.expectHeaderOfTableToMatchFile);
    this.rows.forEach((element, index) => this.expectRowsOfTableToBeCased(element, index, dataFormat));
  }

  expectPreviewTableToMatchFile() {
    this.columns.forEach(this.expectHeaderOfTableToMatchFile);
    this.rows.forEach(this.expectRowsOfTableToMatchFile);
  }

  expectFieldInfoToMatchFile() {
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
      item.forEach((copy, index) => expect(this.fieldInfoRows[index].getText()).to.equal(copy));
      clickElement(this, 'rightArrowBtn');
    });
  }
}
export default new DataSourcePreviewPage();
