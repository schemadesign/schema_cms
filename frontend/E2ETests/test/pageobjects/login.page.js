import Page from './page.js';
const fs = require('fs');
const creds = JSON.parse(fs.readFileSync('creds.json', 'utf-8'));
const ADMIN = 'admin';
const EDITOR = 'editor';
const VALID = 'valid';
const INVALID = 'invalid';
const EMPTY = 'empty';

class LoginPage extends Page {

    get username() { return $('#\\31-email'); }
    get password() { return $('.auth0-lock-input-show-password input'); }
    get forgotPassword() { return $('.auth0-lock-alternative-link'); }
    get loginBtn() { return $('button > span'); }
    get loginWithGoogleBtn() { return $('auth0-lock-social-Btn'); }
    get emptyLoginError() { return $('#auth0-lock-error-msg-email'); }
    get emptyPasswordError() { return $('#auth0-lock-error-msg-password'); }
    get wrongCredsError() { return $('.fadeInUp span'); }
    get resetPasswordHeader() { return $("[title='Reset your password']"); }
    get resetPasswordBtn() { return $("[aria-label='Send email']"); }
    get successMsg() { return $(".auth0-global-message-success"); }
    get newPassword() { return $('[placeholder="your new password"]'); }
    get confirmNewPassword() { return $("[placeholder='confirm your new password']"); }
    get submitNewPassword() { return $("[type='submit']") }
    get changePasswordHeader() { return $('.auth0-lock-name'); }
    get changePasswordSuccessMsg() { return $('span:nth-child(5) > div > div > p'); }
    get changePasswordFailMsg() { return $('span:nth-child(2) > div > span'); }


    open() {
        super.open('');
    }


    waitForLoginPageToLoad() {
        browser.waitUntil(() => {
           return this.loginBtn.isDisplayed();
        },10000, 'Login page not displayed after 10 seconds');
    }

    waitForCredsErrorToLoad() {
        browser.waitUntil(() => {
            return this.wrongCredsError.isDisplayed();
        }, 10000, 'Error not visible after 10 seconds');
        
    }

    waitForChangePasswordToLoad() {
        browser.switchWindow('Change your password');
        browser.waitUntil(() => {
            return this.changePasswordHeader.getText() === 'Change Password'
          }, 5000, 'Expected text is not visible');
    }

    waitForUsernameToLoad() {
        browser.waitUntil(() => {
            return this.username.isDisplayed();
        }, 10000, 'Username noy visible after 10 seconds');
    }

    waitForForgotPasswordToLoad() {
        browser.waitUntil(() => {
            return this.forgotPassword.isDisplayed();
        }, 10000, 'Forgot password link not visible after 10 seconds');
    }

    waitForNewPasswordToLoad() {
        browser.waitUntil(() => {
            return this.newPassword.isDisplayed();
        }, 10000, 'New password not visible after 10 seconds');
    }

    waitForSuccessMsgToLoad() {
        browser.waitUntil(() => {
            return this.successMsg.isDisplayed();
        }, 10000, 'Success message not visible after 10 seconds');
    }

    waitForChangePasswordFailMsgToLoad() {
        browser.waitUntil(() => {
            return this.changePasswordFailMsg.isDisplayed();
        }, 10000, 'Change password fail message not visible after 10 seconds');
    }

    login(loginState, passwordState) {
        this.waitForLoginPageToLoad();
        if(loginState === INVALID && passwordState === INVALID) {
            this.username.setValue(creds.invalidLogin);
            this.password.setValue(creds.invalidPassword);
            this.loginBtn.click();
        }

        if(loginState === INVALID && passwordState === VALID) {
            this.username.setValue(creds.invalidLogin);
            this.password.setValue(creds.validPassword);
            this.loginBtn.click();
        }

        if(loginState === VALID && passwordState === INVALID) {
            this.username.setValue(creds.validLogin);
            this.password.setValue(creds.invalidPassword);
            this.loginBtn.click();
        }
        
        if(loginState === EMPTY && passwordState === EMPTY) {
            this.username.setValue('');
            this.password.setValue('');
            this.loginBtn.click();
        }

        if(loginState === EMPTY && passwordState === VALID) {
            this.username.setValue('');
            this.password.setValue(creds.validPassword);
            this.loginBtn.click();
        }

        if(loginState === VALID && passwordState === EMPTY) {
            this.username.setValue(creds.validLogin);
            this.password.setValue('');
            this.loginBtn.click();
        }
    }

    loginByRole(userRole) {
        if(userRole === ADMIN) {
            this.username.setValue(creds.admin.login);
            this.password.setValue(creds.admin.password);
            this.loginBtn.click();
        }

        if(userRole === EDITOR) {
            this.username.setValue(creds.editor.login);
            this.password.setValue(creds.editor.password);
            this.loginBtn.click();
        }
    }

    loginWithNewPassword() {
        browser.refresh();
        this.waitForUsernameToLoad();
        this.username.setValue(creds.resetPassword.validEmail);
        this.password.setValue(creds.setNewPassword.newPassword);
        this.loginBtn.click();
        this.updatePasswordsInFile();
    }

    loginWithOldPassword() {
        this.waitForUsernameToLoad();
        this.username.setValue(creds.resetPassword.validEmail);
        this.password.setValue(creds.resetPassword.oldPassword);
        this.loginBtn.click();
    }

    loginWithNewInvalidPassword() {
        this.waitForUsernameToLoad();
        this.username.setValue(creds.resetPassword.validEmail);
        this.password.setValue(creds.setNewPassword.confirmInvalidPassword);
        this.loginBtn.click();
    }

    loginWithGoogle () {
        this.waitForLoginPageToLoad();
        this.loginWithGoogleBtn.click();
    }

    resetPassword() {
        this.waitForForgotPasswordToLoad();
        this.forgotPassword.click();
        this.waitForUsernameToLoad();
        this.username.setValue(creds.resetPassword.validEmail);
        this.resetPasswordBtn.click(); 
    }

    resetPasswordWithInvalidEmail() {
        this.waitForForgotPasswordToLoad();
        this.forgotPassword.click();
        this.waitForUsernameToLoad();
        this.username.setValue(creds.resetPassword.invalidEmail);
        this.resetPasswordBtn.click();
    }

    setNewPassword() {
        this.waitForNewPasswordToLoad();
        this.newPassword.setValue(creds.setNewPassword.newPassword);
        this.confirmNewPassword.setValue(creds.setNewPassword.confirmNewPassword);
        this.submitNewPassword.click();
    }

    setInvalidPassword() {
        this.waitForNewPasswordToLoad();
        this.newPassword.setValue(creds.setNewPassword.newPassword);
        this.confirmNewPassword.setValue(creds.setNewPassword.confirmInvalidPassword);
        this.submitNewPassword.click();
    }

    updatePasswordsInFile() {
        let oldPassword = creds.resetPassword.oldPassword;
        let newPassword = creds.setNewPassword.newPassword;
        creds.resetPassword.oldPassword = newPassword;
        creds.setNewPassword.newPassword = oldPassword;
        creds.setNewPassword.confirmNewPassword = oldPassword;
        fs.writeFileSync('creds.json', JSON.stringify(creds, null, 2));
    }
}
export default new LoginPage();