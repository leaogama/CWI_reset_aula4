class LoginPage {
    inputUsername = '[data-test="username"]'
    inputPassword = '[data-test="password"]'
    btnLogin = '[data-test="login-button"]'
    url = 'https://www.saucedemo.com'

    acessar() {
        cy.visit(this.url)
    }

    login(username, password) {
        if(username!= '') {
            cy.get(this.inputUsername).type(username)
        } else{
            cy.get(this.inputUsername).type('')
        }
            if(password != '') {
            cy.get(this.inputPassword).type(password)
        }else{
            cy.get(this.inputUsername).type('{enter}')
        }
            cy.get(this.btnLogin).click()
    }

    preencherUsername(username){
        cy.get(this.inputUsername).type(username)
    }

    preencherPassword(password) {
        cy.get(this.inputPassword).type(password)
    }

    autenticar(){
        cy.get(this.btnLogin).click()
    }
}

export default LoginPage