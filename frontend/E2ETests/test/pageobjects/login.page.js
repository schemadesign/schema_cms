import Page from './page.js';
const fs = require('fs');
const creds = JSON.parse(fs.readFileSync('creds.json', 'utf-8'));

class LoginPage extends Page {

    get usernameInput() { return $(''); }
    get passwordInput() { return $(''); }
    get forgotPassword() { return $(''); }
    get loginButton() { return $(''); }
    

    open() {
        super.open('');
        browser.pause(1000);
    }

    waitForLoginPageToLoad () {
        if(!this.loginButton.isDisplayed()) {
            this.loginButton.waitForDisplayed();
        }
    }

    loginAsAdmin () {
        this.waitForLoginPageToLoad();
        this.usernameInput.setValue(creds.admin.login);
        this.passwordInput.setValue(creds.admin.password);
        this.loginButton.click();
        browser.pause(2000);
    }
        
    loginAsEditor() {
        this.waitForLoginPageToLoad();
        this.usernameInput.setValue(creds.editor.login);
        this.passwordInput.setValue(creds.editor.password);
        this.loginButton.click();
        browser.pause(2000); 
    }
}
export default new LoginPage();