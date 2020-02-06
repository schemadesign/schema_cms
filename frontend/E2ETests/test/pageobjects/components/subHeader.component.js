class SubHeaderComponent {
  get title() {
    return $('#desktopHeaderTitle');
  }

  get subtitle() {
    return $('#desktopHeaderSubtitle');
  }

  get createBtn() {
    return $('#createDataSourceDesktopBtn');
  }

  get sourceBtn() {
    return $('#sourceBtn');
  }

  get fieldsBtn() {
    return $('#fieldsBtn');
  }

  get stepsBtn() {
    return $('#stepsBtn');
  }

  get resultsBtn() {
    return $('#resultsBtn');
  }

  get filtersBtn() {
    return $('#filtersBtn');
  }

  get tagsBtn() {
    return $('#tagsBtn');
  }
}
export default new SubHeaderComponent();
