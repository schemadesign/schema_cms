import Page from './page';
import TopHeaderComponent from './components/topHeader.component';

class SettingsPage extends Page {
  get TopHeader() {
    return TopHeaderComponent;
  }

  get firstNameLabel() {
    return $('[for="firstName"]');
  }

  get firstNameValue() {
    return $('#firstName');
  }

  get lastNameLabel() {
    return $('[for="lastName"]');
  }

  get lastNameValue() {
    return $('#lastName');
  }

  get emailLabel() {
    return $('[for="email"]');
  }

  get emailValue() {
    return $('#email');
  }

  get userRoleLabel() {
    return $('[for="role"]');
  }

  get userRoleValue() {
    return $('#role');
  }

  get resetPasswordLink() {
    return $('#resetPasswordLink');
  }

  get backBtn() {
    return $('#settingsBackBtn');
  }

  get saveBtn() {
    return $('#settingsSaveBtn');
  }
}
export default new SettingsPage();
