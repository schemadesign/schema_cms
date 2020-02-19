class TabsComponent {
  get container() {
    return $('#tabsContainer');
  }

  get settings() {
    return $('#settingsTab');
  }

  get sources() {
    return $('#sourcesTab');
  }

  get users() {
    return $('#usersTab');
  }

  get pages() {
    return $('#folderTab');
  }

  get states() {
    return $('#stateTab');
  }
}
export default new TabsComponent();
