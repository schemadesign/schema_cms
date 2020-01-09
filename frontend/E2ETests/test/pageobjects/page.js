export default class Page {
  constructor() {
    this._projectName = '';
  }

  open(path) {
    browser.url(path);
  }
}
