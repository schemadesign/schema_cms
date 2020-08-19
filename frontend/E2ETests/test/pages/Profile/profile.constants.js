import Profile from './profile.page';

export const SETTINGS_PAGE_LABELS = ['First Name', 'Last Name', 'Email', 'Role', 'Reset password'];
export const SETTINGS_PAGE_ELEMENTS = [
  Profile.firstNameLabel(),
  Profile.lastNameLabel(),
  Profile.emailLabel(),
  Profile.roleLabel(),
  Profile.resetPasswordLink(),
];
