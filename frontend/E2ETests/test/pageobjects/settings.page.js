import Page from './page';

class SettingsPage extends Page {
  get closeBtn() {
    return $('');
  }

  get headerTitle() {
    return $('');
  }

  // elements available when accessing Settings from Projects page
  get adminUser() {
    return $('');
  }

  get aws() {
    return $('');
  }

  get database() {
    return $('');
  }

  get apiDocumentation() {
    return $('');
  }

  get githubRepository() {
    return $('');
  }

  get about() {
    return $('');
  }

  get logoutBtn() {
    return $('');
  }

  // elements available when accessing Settings from Project Details page
  get datasources() {
    return $('');
  }

  get charts() {
    return $('');
  }

  get pages() {
    return $('');
  }

  get users() {
    return $('');
  }

  get projectSummary() {
    return $('');
  }

  get projectSettings() {
    return $('');
  }

  get deleteProject() {
    return $('');
  }

  waitForSettingsToLoad() {
    if (!this.about.isDisplayed()) {
      this.about.waitForDisplayed();
    }
  }

  logout() {
    this.waitForSettingsToLoad();
    this.logoutBtn.click();
    browser.pause(1000);
  }
}
export default new SettingsPage();
