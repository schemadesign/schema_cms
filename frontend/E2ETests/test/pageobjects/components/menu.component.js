class MenuComponent {
  get closeBtn() {
    return $('#desktopTopHeaderCloseMenuButton');
  }

  get projects() {
    return $('#projectNavBtn');
  }

  get users() {
    return $('#userNavBtn');
  }

  get aboutSchemaCMS() {
    return $('#aboutNavBtn');
  }

  get apiDoc() {
    return $('#apiNavBtn');
  }

  get githubRepo() {
    return $('#repositoryNavBtn');
  }
}
export default new MenuComponent();
