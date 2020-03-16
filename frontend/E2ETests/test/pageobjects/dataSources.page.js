import Page from './page';
import TopHeaderComponent from './components/topHeader.component';
import MenuComponent from './components/menu.component';
import { waitForText } from '../utils/utils';
import { DATASOURCE_STATUS } from '../constants/createDatasource.constants';

class DataSourcesPage extends Page {
  get TopHeader() {
    return TopHeaderComponent;
  }

  get Menu() {
    return MenuComponent;
  }

  get title() {
    return $('#desktopHeaderTitle');
  }

  get subtitle() {
    return $('#desktopHeaderSubtitle');
  }

  get createDataSourceBtn() {
    return $('#createDataSourceDesktopBtn');
  }

  get backBtn() {
    return $('#backBtn');
  }

  get creationDate() {
    return $('#headerItem-0');
  }

  get dataSourceStatus() {
    return $('#dataSourceStatus');
  }

  get dataSourceCreator() {
    return $('#dataSourceContainer:first-child #headerItem-1');
  }

  get dataSourceTitle() {
    return $('#dataSourceTitle');
  }

  get sourceLabel() {
    return $('#metaItem-0');
  }

  get sourceIcon() {
    return $('#metaItemValue-0');
  }

  get itemsLabel() {
    return $('#metaItem-1');
  }

  get itemsValue() {
    return $('#metaItemValue-1');
  }

  get fieldsLabel() {
    return $('#metaItem-2');
  }

  get fieldsValue() {
    return $('#metaItemValue-2');
  }

  get filtersLabel() {
    return $('#metaItem-3');
  }

  get filtersValue() {
    return $('#metaItemValue-3');
  }

  get viewsLabel() {
    return $('#metaItem-4');
  }

  get viewsValue() {
    return $('#metaItemValue-4');
  }

  get jobListHeader() {
    return $('#jobListHeader > span');
  }

  get jobStateValue() {
    return $('#jobStateValue');
  }

  get jobIdLabel() {
    return $('#jobIdLabel > span');
  }

  get jobIdValue() {
    return $('#jobIdValue');
  }

  get updatedAtLabel() {
    return $('#jobUpdatedAtLabel > span');
  }

  get updatedAtValue() {
    return $('#jobUpdatedAtValue');
  }

  waitForDataSourceStatusToChange(dataSourceState) {
    DATASOURCE_STATUS[dataSourceState].forEach(item => waitForText(this, 'dataSourceStatus', item));
  }
}
export default new DataSourcesPage();
