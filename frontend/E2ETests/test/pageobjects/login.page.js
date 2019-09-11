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
    get loginBtn() { return $('.auth0-lock-submit'); }
    get loginWithGoogleBtn() { return $('auth0-lock-social-Btn'); }
    get emptyLoginError() { return $('#auth0-lock-error-msg-email'); }
    get emptyPasswordError() { return $('#auth0-lock-error-msg-password'); }
    get wrongCredsError() { return $('.fadeInUp span'); }

    open() {
        super.open('');
    }

    waitForLoginPageToLoad() {
        if(!this.loginBtn.isDisplayed()) {
            this.loginBtn.waitForDisplayed();
        }
    }

    waitForCredsErrorToLoad() {
        if(!this.wrongCredsError.isDisplayed()) {
            this.wrongCredsError.waitForDisplayed();
        }
    }

    login(param1, param2) {
        this.waitForLoginPageToLoad();
        
        if(param1 === ADMIN) {
            this.username.setValue(creds.admin.login);
            this.password.setValue(creds.admin.password);
            this.loginBtn.click();
        }

        if(param1 === EDITOR) {
            this.username.setValue(creds.editor.login);
            this.password.setValue(creds.editor.password);
            this.loginBtn.click();
        }

        if(param1 === INVALID && param2 === INVALID) {
            this.username.setValue(creds.invalidLogin);
            this.password.setValue(creds.invalidPassword);
            this.loginBtn.click();
        }

        if(param1 === INVALID && param2 === VALID) {
            this.username.setValue(creds.invalidLogin);
            this.password.setValue(creds.validPassword);
            this.loginBtn.click();
        }

        if(param1 === VALID && param2 === INVALID) {
            this.username.setValue(creds.validLogin);
            this.password.setValue(creds.invalidPassword);
            this.loginBtn.click();
        }
        
        if(param1 === EMPTY && param2 === EMPTY) {
            this.username.setValue('');
            this.password.setValue('');
            this.loginBtn.click();
        }

        if(param1 === EMPTY && param2 === VALID) {
            this.username.setValue('');
            this.password.setValue(creds.validPassword);
            this.loginBtn.click();
        }

        if(param1 === VALID && param2 === EMPTY) {
            this.username.setValue(creds.validLogin);
            this.password.setValue('');
            this.loginBtn.click();
        }
    }

    loginWithGoogle () {
        this.waitForLoginPageToLoad();
        this.loginWithGoogleBtn.click();
    }
}
export default new LoginPage();