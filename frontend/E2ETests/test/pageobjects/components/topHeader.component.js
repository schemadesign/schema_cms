class TopHeaderComponent {
  get menuBtn() {
    return $('#topHeaderOpenMenuBtn');
  }

  get projectName() {
    return $('');
  }

  get logo() {
    return $('[href="/"]');
  }

  get logoutBtn() {
    return $('');
  }

  get settingsBtn() {
    return $('[href="/settings"]');
  }
}
export default new TopHeaderComponent();
