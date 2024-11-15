describe('another user happy path', () => {
  it('navigate to register', () => {
    cy.visit('localhost:3000/');
    cy.contains('Register').click();
    cy.url().should('include', 'localhost:3000/register');
  });

  const login = () => {
    cy.visit('localhost:3000/login');
    cy.get('input[id="login-email"]').focus().type('anotherrandomemail@mails.com');
    cy.get('input[id="login-password"]').focus().type('password');
    cy.get('button[id="login-submit"]').click();
    cy.url().should('include', 'localhost:3000/dashboard');
  }

  it('register or login a user and goes to dashboard', () => {
    cy.visit('localhost:3000/register');
    cy.get('input[id="register-email"]').focus().type('anotherrandomemail@mails.com');
    cy.get('input[id="register-password"]').focus().type('password');
    cy.get('input[id="register-confirm-password"]').focus().type('password');
    cy.get('input[id="register-name"]').focus().type('tester');
    cy.contains('REGISTER').click();
    cy.get('body').then((body) => {
      cy.wait(500).then(() => {
        if (body.find('input[id="register-email"]').length > 0) {
          login();
        } else {
          cy.url().should('include', 'localhost:3000/dashboard')
        }
      })
    })
  });

  it('create presentation and create a text box', () => {
    login();
    cy.contains('CREATE').click();
    cy.get('input[name="name"]').focus().type('new pres');
    cy.contains('CREATE').click();
    cy.contains('new pres').click();
    cy.url().should('include', 'localhost:3000/design');
    cy.get('button[id="text-add"]').click();
    cy.contains('Add a text box');
    cy.get('input[name="Text"]').focus().type('blah');
    cy.get('input[name="Width"]').focus().type('50');
    cy.get('input[name="Height"]').focus().type('50');
    cy.get('input[name="Font size"]').focus().type('1');
    cy.get('input[name="Colour"]').focus().type('#123456');
    cy.contains('Submit').click();
    cy.contains('Add a text box').should('not.exist');
    cy.contains('blah');
  })

  it('edit the text', () => {
    login();
    cy.contains('new pres').click();
    cy.get('.text-div').trigger('click').trigger('click');
    cy.contains('Edit a text box');
    cy.get('input[name="Text"]').focus().type('hhh');
    cy.contains('Submit').click();
    cy.contains('Edit a text box').should('not.exist');
    cy.contains('blahhhh');
  })

  it ('delete the presentation', () => {
    login();
    cy.contains('new pres').click();
    cy.get('button[id="delete-pres"]').click();
    cy.get('button[id="yes-delete"]').click();
  })

})