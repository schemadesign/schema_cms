import Page from './page';
import TopHeaderComponent from './components/topHeader.component';
import MenuComponent from './components/menu.component';

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

  get createDataSourceBtn() {
    return $('#createDataSourceDesktopBtn');
  }

  get backBtn() {
    return $('#backBtn');
  }

  get creationDate() {
    return $('#headerItem-0');
  }

  get dataSourceCreator() {
    return $('#headerItem-1');
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
}
export default new DataSourcesPage();
