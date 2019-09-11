import Page from './page.js';
const fs = require('fs');
const creds = JSON.parse(fs.readFileSync('creds.json', 'utf-8'));

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
        
        if(param1 === 'admin') {
            this.username.setValue(creds.admin.login);
            this.password.setValue(creds.admin.password);
            this.loginBtn.click();
        }

        if(param1 === 'editor') {
            this.username.setValue(creds.editor.login);
            this.password.setValue(creds.editor.password);
            this.loginBtn.click();
        }

        if(param1 === 'invalid' && param2 === 'invalid') {
            this.username.setValue(creds.invalidLogin);
            this.password.setValue(creds.invalidPassword);
            this.loginBtn.click();
        }

        if(param1 === 'invalid' && param2 === 'valid') {
            this.username.setValue(creds.invalidLogin);
            this.password.setValue(creds.validPassword);
            this.loginBtn.click();
        }

        if(param1 === 'valid' && param2 === 'invalid') {
            this.username.setValue(creds.validLogin);
            this.password.setValue(creds.invalidPassword);
            this.loginBtn.click();
        }
        
        if(param1 === 'empty' && param2 === 'empty') {
            this.username.setValue('');
            this.password.setValue('');
            this.loginBtn.click();
        }

        if(param1 === 'empty' && param2 === 'valid') {
            this.username.setValue('');
            this.password.setValue(creds.validPassword);
            this.loginBtn.click();
        }

        if(param1 === 'valid' && param2 === 'empty') {
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