/// <reference types="cypress" />
import LoginPage from '../../pages/login-page'
import ProductsPage from '../../pages/products-page'
import CartPage from '../../pages/cart-page'
import InformationPage from '../../pages/information-page'



// Accepted usernames are:
// standard_user
// locked_out_user
// problem_user
// performance_glitch_user

// Password for all users:
// secret_sauce

describe('Swag Labs', () => {
    const loginPage = new LoginPage()
    const productsPage = new ProductsPage()
    const cartPage = new CartPage()
    const informationPage = new InformationPage()
    let eee = 'temp'


    context('LOGIN', () => {
        beforeEach(() => {
            loginPage.acessar()
        })

        it('00-Deve acessar o swaglabs com sucesso', () => {
            cy.url().should('contains', 'saucedemo')
        })

        it('01-Deve exibir mensagem ao logar sem informar usuário', () => {
            cy.get('[data-test="login-button"]').click()
            cy.get('form h3').should('have.text', 'Epic sadface: Username is required')
        })

        it('02-Deve exibir mensagem ao logar sem informar senha', () => {
            loginPage.login('standard_user', '{backspace}')
            cy.get('[data-test="login-button"]').click()
            cy.get('[data-test="error"]').should('have.text', 'Epic sadface: Password is required')
        })

        it('03-Deve exibir mensagem ao logar sem informar usuário e senha', () => {
            loginPage.login('standard_user', '{backspace}')
            cy.get('[data-test="login-button"]').click()
            cy.get('[data-test="error"]').should('have.text', 'Epic sadface: Password is required')
        })

        it('04-Deve exibir mensagem ao logar com usuário bloqueado', () => {
            loginPage.login('locked_out_user', 'secret_sauce')
            cy.get('[data-test="error"]').should('have.text', 'Epic sadface: Sorry, this user has been locked out.')
        });

        it('05-Deve exibir mensagem ao acessar página de produtos sem estar autenticado', () => {
            // PRECISA 'failOnStatusCode: false' e usar aspas dupla externa    
            cy.visit('https://www.saucedemo.com/inventory.html', { failOnStatusCode: false })
            cy.get('[data-test="error"]').should('have.text', "Epic sadface: You can only access '/inventory.html' when you are logged in.")
        });

        it('06-Deve realizar login com sucesso', () => {
            // cy.get('[data-test="username"]').type('standard_user')
            // cy.get('[data-test="password"]').type('secret_sauce')
            // cy.get('[data-test="login-button"]').click()
            loginPage.login('standard_user', 'secret_sauce')
            cy.url().should('include', 'inventory.html')
            cy.get('.title').should('have.text', 'Products')
        })




    });

    context('LOGOUT', () => {

        beforeEach(() => {
            loginPage.acessar()
        });

        it('07-Deve exibir página de login ao selecionar logout', () => {
            loginPage.login('standard_user', 'secret_sauce')
            cy.url().should('include', 'inventory.html')
            cy.get('.title').should('have.text', 'Products')
            cy.get('#react-burger-menu-btn').click();
            cy.get('#logout_sidebar_link').focus().click()
            cy.url('https://www.saucedemo.com/')
            cy.get('[data-test="username"]').should('not.have.value')
            cy.get('[data-test="password"]').should('not.have.value')
        })

        it('08-Deve exibir mensagem ao acessar página de produtos após ter feito logout', () => {
            loginPage.login('standard_user', 'secret_sauce')
            cy.url().should('include', 'inventory.html')
            cy.get('.title').should('have.text', 'Products')
            cy.get('#react-burger-menu-btn').click();
            cy.get('#logout_sidebar_link').focus().click()
            cy.url('https://www.saucedemo.com/')
            cy.get('[data-test="username"]').should('not.have.value')
            cy.get('[data-test="password"]').should('not.have.value')
            cy.visit('https://www.saucedemo.com/inventory.html', { failOnStatusCode: false })
            cy.get('[data-test="error"]').should('have.text', "Epic sadface: You can only access '/inventory.html' when you are logged in.")
        })
    })



    context('CARRINHO', () => {
        // variaveis globais
        let nomeProduto0
        let valorProduto0
        let nomeProduto1
        let valorProduto1
        const numProduto01 = 0
        const numProduto02 = 1

        beforeEach(() => {
            cy.viewport(1280, 1400)
            loginPage.acessar()
            loginPage.login('standard_user', 'secret_sauce')


            //Alimenta variaveis globais
            cy.get('.inventory_item_name').eq(numProduto01).then($element => {
                nomeProduto0 = $element.text()
            })
            cy.get('.inventory_item_price').eq(numProduto01).then($element => {
                valorProduto0 = $element.text()
            })
            cy.get('.inventory_item_name').eq(numProduto02).then($element => {
                nomeProduto1 = $element.text()
            })
            cy.get('.inventory_item_price').eq(numProduto02).then($element => {
                valorProduto1 = $element.text()
            })
        })

        it('09-Deve exibir carrinho vazio ao acessar sem ter adicionado itens no carrinho', () => {
            cy.get('.shopping_cart_link').should('have.text', '')
            productsPage.acessarCarrinho()
            cy.get('.cart_item').should('not.exist')
        });

        it('10-Deve exibir produto adicionado no carrinho ao acessar o carrinho', () => {
            productsPage.adicionarProduto(0)
            productsPage.acessarCarrinho()
            cy.get('.cart_item').should('exist')
            cy.get('.inventory_item_name').should('have.text', nomeProduto0)
            cy.get('.inventory_item_price').should('have.text', valorProduto0)
        })

        it('11-Deve exibir produtos adicionados no carrinho ao acessar o carrinho', () => {
            productsPage.adicionarProduto(numProduto01)
            productsPage.adicionarProduto(numProduto02)
            productsPage.acessarCarrinho()
            cy.get('.inventory_item_name').eq(numProduto01).should('have.text', nomeProduto0)
            cy.get('.inventory_item_price').eq(numProduto01).should('have.text', valorProduto0)
            cy.get('.inventory_item_name').eq(numProduto02).should('have.text', nomeProduto1)
            cy.get('.inventory_item_price').eq(numProduto02).should('have.text', valorProduto1)
            console.clear()
            console.log(nomeProduto0 + ' - ' + valorProduto0)
            console.log(nomeProduto1 + ' - ' + valorProduto1)
        })

        it('12-Deve exibir no icone de carrinho quantos produtos foram adicionados no carrinho', () => {
            productsPage.adicionarProduto(0)
            productsPage.acessarCarrinho()
            cy.get('.cart_item').should('exist')
            cy.get('.inventory_item_name').should('have.text', nomeProduto0)
            cy.get('.inventory_item_price').should('have.text', valorProduto0)
            cy.get('.shopping_cart_badge').should('have.text', '1')
        })
        it('13-Deve exibir no icone de carrinho quantos produtos restaram ao remover produto do carrinho', () => {
            productsPage.adicionarProduto(0)
            productsPage.acessarCarrinho()
            cy.get('.cart_item').should('exist')
            cy.get('.inventory_item_name').should('have.text', nomeProduto0)
            cy.get('.inventory_item_price').should('have.text', valorProduto0)
            cy.get('.shopping_cart_badge').should('have.text', '1')
            cy.get('[data-test="remove-sauce-labs-backpack"]').click();
            cy.get('.shopping_cart_badge').should('not.exist')
        })


        it('14-Deve exibir no icone de carrinho quantos produtos foram adicionados no carrinho', () => {
            productsPage.adicionarProduto(numProduto01)
            productsPage.adicionarProduto(numProduto02)
            productsPage.acessarCarrinho()
            cy.get('.inventory_item_name').eq(numProduto01).should('have.text', nomeProduto0)
            cy.get('.inventory_item_price').eq(numProduto01).should('have.text', valorProduto0)
            cy.get('.inventory_item_name').eq(numProduto02).should('have.text', nomeProduto1)
            cy.get('.inventory_item_price').eq(numProduto02).should('have.text', valorProduto1)
            cy.get('.shopping_cart_badge').should('have.text', '2')
            console.clear()
            console.log(nomeProduto0 + ' - ' + valorProduto0)
            console.log(nomeProduto1 + ' - ' + valorProduto1)


        })

        it('15-Deve exibir no icone de carrinho quantos produtos restaram ao remover um produto do carrinho', () => {
            productsPage.adicionarProduto(numProduto01)
            productsPage.adicionarProduto(numProduto02)
            productsPage.acessarCarrinho()
            cy.get('.inventory_item_name').eq(numProduto01).should('have.text', nomeProduto0)
            cy.get('.inventory_item_price').eq(numProduto01).should('have.text', valorProduto0)
            cy.get('.inventory_item_name').eq(numProduto02).should('have.text', nomeProduto1)
            cy.get('.inventory_item_price').eq(numProduto02).should('have.text', valorProduto1)
            cy.get('.shopping_cart_badge').should('have.text', '2')
            console.clear()
            console.log(nomeProduto0 + ' - ' + valorProduto0)
            console.log(nomeProduto1 + ' - ' + valorProduto1)
            cy.get('[data-test*="remove-"]').eq(0).click()
            cy.get('.shopping_cart_badge').should('have.text', '1')


        })

        it('16-Deve remover todos produtos para icone do carrinho vazio', () => {
            productsPage.adicionarProduto(numProduto01)
            productsPage.adicionarProduto(numProduto02)
            productsPage.acessarCarrinho()
            cy.get('.inventory_item_name').eq(numProduto01).should('have.text', nomeProduto0)
            cy.get('.inventory_item_price').eq(numProduto01).should('have.text', valorProduto0)
            cy.get('.inventory_item_name').eq(numProduto02).should('have.text', nomeProduto1)
            cy.get('.inventory_item_price').eq(numProduto02).should('have.text', valorProduto1)
            cy.get('.shopping_cart_badge').should('have.text', '2')
            console.clear()
            console.log(nomeProduto0 + ' - ' + valorProduto0)
            console.log(nomeProduto1 + ' - ' + valorProduto1)
            cy.get('[data-test*="remove-"]').eq(0).click()
            cy.get('.shopping_cart_badge').should('have.text', '1')
            cy.get('[data-test*="remove-"]').eq(0).click()
            cy.get('.shopping_cart_badge').should('not.exist')

        })


        it('17-Deve remover todos produtos da página do carrinho vazio', () => {
            productsPage.adicionarProduto(numProduto01)
            productsPage.adicionarProduto(numProduto02)
            productsPage.acessarCarrinho()
            cy.get('.inventory_item_name').eq(numProduto01).should('have.text', nomeProduto0)
            cy.get('.inventory_item_price').eq(numProduto01).should('have.text', valorProduto0)
            cy.get('.inventory_item_name').eq(numProduto02).should('have.text', nomeProduto1)
            cy.get('.inventory_item_price').eq(numProduto02).should('have.text', valorProduto1)
            cy.get('.shopping_cart_badge').should('have.text', '2')
            console.clear()
            console.log(nomeProduto0 + ' - ' + valorProduto0)
            console.log(nomeProduto1 + ' - ' + valorProduto1)
            cy.get('[data-test*="remove-"]').eq(0).click()
            cy.get('[data-test*="remove-"]').eq(0).click()
            cy.get('.cart_item').should('not.exist')
        })


    })


    context('CHECKOUT', () => {
        // variaveis globais
        let nomeProduto0
        let valorProduto0
        let nomeProduto1
        let valorProduto1
        const numProduto01 = 0
        const numProduto02 = 1

        beforeEach(() => {
            cy.viewport(1280, 1400)
            loginPage.acessar()
            loginPage.login('standard_user', 'secret_sauce')


            //Alimenta variaveis globais
            cy.get('.inventory_item_name').eq(numProduto01).then($element => {
                nomeProduto0 = $element.text()
            })
            cy.get('.inventory_item_price').eq(numProduto01).then($element => {
                valorProduto0 = $element.text()
            })
            cy.get('.inventory_item_name').eq(numProduto02).then($element => {
                nomeProduto1 = $element.text()
            })
            cy.get('.inventory_item_price').eq(numProduto02).then($element => {
                valorProduto1 = $element.text()
            })
        })



        it('18-Deve exibir página do checkout a partir da página de carrinho', () => {
            productsPage.acessarCarrinho()
            cartPage.fazerCheckout()
            cy.get('.title').contains('CHECKOUT: YOUR INFORMATION', { matchCase: false })
            cy.url().should('include', 'checkout-step-one.html')
        });
        it('19-Deve exibir mensagem ao prosseguir sem preencher identificação', () => {
            productsPage.acessarCarrinho()
            cartPage.fazerCheckout()
            cy.get('.title').contains('CHECKOUT: YOUR INFORMATION', { matchCase: false })
            cy.url().should('include', 'checkout-step-one.html')
            cy.get('[data-test="continue"]').click()
            cy.get('[data-test="error"]').should('have.text', 'Error: First Name is required')
        });
        it('20-Deve exibir mensagem ao prosseguir sem preencher primeiro nome', () => {
            productsPage.acessarCarrinho()
            cartPage.fazerCheckout()
            cy.get('.title').contains('CHECKOUT: YOUR INFORMATION', { matchCase: false })
            cy.url().should('include', 'checkout-step-one.html')
            cy.get('[data-test="lastName"]').type('qwe')
            cy.get('[data-test="postalCode"]').type('012345')
            cy.get('[data-test="continue"]').click()
            cy.get('[data-test="error"]').should('have.text', 'Error: First Name is required')
        });
        it('21-Deve exibir mensagem ao prosseguir sem preencher último nome', () => {
            productsPage.acessarCarrinho()
            cartPage.fazerCheckout()
            cy.get('.title').contains('CHECKOUT: YOUR INFORMATION', { matchCase: false })
            cy.url().should('include', 'checkout-step-one.html')
            cy.get('[data-test="firstName"]').type('wrau')
            cy.get('[data-test="postalCode"]').type('012345')
            cy.get('[data-test="continue"]').click()
            cy.get('[data-test="error"]').should('have.text', 'Error: Last Name is required')
        });
        it('22-Deve exibir mensagem ao prosseguir sem preencher cep', () => {
            productsPage.acessarCarrinho()
            cartPage.fazerCheckout()
            cy.get('.title').contains('CHECKOUT: YOUR INFORMATION', { matchCase: false })
            cy.url().should('include', 'checkout-step-one.html')
            cy.get('[data-test="firstName"]').type('wrau')
            cy.get('[data-test="lastName"]').type('qwe')
            //cy.get('[data-test="postalCode"]').type('012345')
            cy.get('[data-test="continue"]').click()
            cy.get('[data-test="error"]').should('have.text', 'Error: Postal Code is required')
        });
        it('23-Deve exibir página de revisão da compra ao prosseguir com identificação válida', () => {
            productsPage.acessarCarrinho()
            cartPage.fazerCheckout()
            cy.get('.title').contains('CHECKOUT: YOUR INFORMATION', { matchCase: false })
            cy.url().should('include', 'checkout-step-one.html')
            cy.get('[data-test="firstName"]').type('wrau')
            cy.get('[data-test="lastName"]').type('qwe')
            cy.get('[data-test="postalCode"]').type('012345')
            cy.get('[data-test="continue"]').click()
            cy.get('.title').contains('CHECKOUT: OVERVIEW', { matchCase: false })
            cy.url().should('include', 'checkout-step-two.html')

            //cy.get('[data-test="error"]').should('have.text', 'Error: Postal Code is required')
        });
        it('24-Deve exibir página de compra finalizada ao finalizar compra', () => {
            productsPage.acessarCarrinho()
            cartPage.fazerCheckout()
            cy.get('.title').contains('CHECKOUT: YOUR INFORMATION', { matchCase: false })
            cy.url().should('include', 'checkout-step-one.html')
            cy.get('[data-test="firstName"]').type('wrau')
            cy.get('[data-test="lastName"]').type('qwe')
            cy.get('[data-test="postalCode"]').type('012345')
            cy.get('[data-test="continue"]').click()

            cy.get('.title').contains('CHECKOUT: OVERVIEW', { matchCase: false })
            cy.url().should('include', 'checkout-step-two.html')
            cy.get('[data-test="finish"]').click()
            cy.get('.title').contains('CHECKOUT: complete!', { matchCase: false })
            cy.url().should('include', 'checkout-complete.html')
        });

    })

})