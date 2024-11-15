describe('user happy path', () => {
  it('navigate to landing page', () => {
    cy.visit('localhost:3000/');
    cy.url().should('include', 'localhost:3000/')
  });

  it('navigate to register', () => {
    cy.visit('localhost:3000/');
    cy.contains('Register').click();
    cy.url().should('include', 'localhost:3000/register');
  });

  const login = () => {
    cy.visit('localhost:3000/login');
    cy.get('input[id="login-email"]').focus().type('veryrandomemail@email.com.au');
    cy.get('input[id="login-password"]').focus().type('password');
    cy.get('button[id="login-submit"]').click();
    cy.url().should('include', 'localhost:3000/dashboard');
  }

  it('register or login a user and goes to dashboard', () => {
    cy.visit('localhost:3000/register');
    cy.get('input[id="register-email"]').focus().type('veryrandomemail@email.com.au');
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

  it('create presentation and check that it adds to dashboard with slide number 1', () => {
    login();
    cy.url().should('include', 'localhost:3000/dashboard');
    cy.contains('CREATE').click();
    cy.get('input[name="name"]').focus().type('new pres');
    cy.contains('CREATE').click();
    cy.contains('new pres');
    cy.contains('Slides: 1');
  })
  
  it('goes into presentation and add a new slide', () => {
    login();
    cy.contains('new pres').click();
    cy.contains('Slide 1 of 1');
    cy.get('button[name="add-slide"]').click();
    cy.contains('Slide 1 of 2');
  })

  it('switch between slides', () => {
    login();
    cy.contains('new pres').click();
    cy.contains('Slide 1 of 2');
    cy.get('button[id="next-slide"]').click();
    cy.contains('Slide 2 of 2');
  })

  it('delete presentation and gets redirected back to dashboard', () => {
    login();
    cy.contains('new pres').click();
    cy.get('button[id="delete-pres"]').click();
    cy.get('button[id="yes-delete"]').click();
    cy.url().should('include', 'localhost:3000/dashboard')
    cy.contains('new pres').should('not.exist');
  })

  it('logout, which redirects them to landing page, then login again', () => {
    login();
    cy.get('button[name="logout"]').click();
    cy.contains('Welcome to Presto');
    login();
  })
})