class TopHeaderComponent {
  get menuBtn() {
    return $('#desktopTopHeaderOpenMenuButton');
  }

  get projectName() {
    return $('#desktopTopHeaderProjectTitle');
  }

  get logo() {
    return $('#desktopTopHeaderSchemaLogo');
  }

  get logoutBtn() {
    return $('#desktopTopHeaderLogoutBtn');
  }

  get settingsBtn() {
    return $('#desktopTopHeaderSettingsBtn');
  }
}
export default new TopHeaderComponent();
