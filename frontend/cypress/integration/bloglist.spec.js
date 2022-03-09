before(function () {
  cy.request('POST', 'http://localhost:3003/api/testing/reset')
  const user = {
    name: 'Mr. Bunbun',
    username: 'bunny',
    password: 'bunbun'
  }
  cy.request('POST', 'http://localhost:3003/api/users/', user)
})

describe('Note app', function () {
  beforeEach(function () {
    cy.visit('http://localhost:3000')
  })

  it('can login', function () {
    cy.contains('login').click()
    cy.get('#username').type('bunny')
    cy.get('#password').type('bunbun')
    cy.get('#login-button').click()
    cy.contains('Mr. Bunbun logged in')
  })

  it('can\'t log in with wrong credentials', function () {
    cy.contains('login').click()
    cy.get('#username').type('bunny')
    cy.get('#password').type('kitkat')
    cy.get('#login-button').click()
    cy.get('.error')
      .should('contain', 'wrong credentials')
      .and('have.css', 'color', 'rgb(255, 0, 0)')
  })

  describe('log in via api', function () {
    beforeEach(function () {
      cy.request({
        method: 'POST',
        url: 'http://localhost:3003/api/login',
        body: {
          username: 'bunny',
          password: 'bunbun'
        }
      })
        .then(response => {
          Cypress.env('token', response.body.token)
          window.localStorage.setItem(
            'loggedNoteappUser', JSON.stringify(response.body)
          )
        })
      cy.visit('http://localhost:3000')
    })


    it('can make a blog', function () {
      cy.contains('new blog').click()
      cy.get('#author').type('mr bunbun')
      cy.get('#url').type('http://coolbunnies.blogspot.com')
      cy.get('#title').type('Why am I so cute? Bun don\'t know!')
      cy.get('#save-button').click()
      // expect to see the blog in the list
      cy.contains('Why am I so cute? Bun don\'t know!')
    })

    it('can\'t make a blog without a title', function () {
      cy.contains('new blog').click()
      cy.get('#author').type('mr bunbun')
      cy.get('#url').type('http://coolbunnies.blogspot.com')
      cy.get('#save-button').click()
      // expect to not see the blog in the list
      cy.should('not.contain', 'mr bunbun')
    })

    describe('make a blog by api', function () {
      beforeEach(function () {
        const authorization = `bearer ${Cypress.env('token')}`
        cy.request({
          method: 'POST',
          url: 'http://localhost:3003/api/blogs',
          body: {
            author: 'mr bunbun',
            url: 'http://coolbunnies.blogspot.com',
            title: 'Why am I so cute? Bun don\'t know!'
          },
          headers: {
            authorization
          }
        })
      })

      it('can find the creator', function () {
        cy.contains('show').click()
        cy.contains('likes: 0')
        cy.contains('created by bunny')
      })

      it('can like a blog', function () {
        cy.contains('show').click()
        cy.contains('like').click()
        cy.contains('likes: 1')

        cy.contains('like').click().click().click().click().then(() => {
          cy.contains('likes: 5')
          cy.contains('created by bunny')
        })
      })
    })
  })
})




  //     it('can delete a blog if the user is the creator', function () {
  //       cy.contains('show').click()
  //       const element = cy.contains('delete')
  //       element.click()
  //       cy.should('not.contain', 'Why am I so cute?')
  //     })
  //   })

  //   describe('after making multiple blogs', function () {
  //     beforeEach(function () {
  //       const token = Cypress.env('token');
  //       const authorization = `bearer ${token}`;
  //       const blogs = [
  //         {
  //           author: 'mr bunbun',
  //           url: 'http://coolbunnies.blogspot.com',
  //           title: 'Why am I so cute? Bun don\'t know!',
  //           likes: 3
  //         },
  //         {
  //           author: 'ashe',
  //           url: 'http://catsarecute.ca',
  //           title: 'REOW',
  //           likes: 12
  //         },
  //         {
  //           author: 'hopeful',
  //           url: 'http://youtube.ca/ilovecatnip',
  //           title: 'Don\'t call me snookerberry farm boy',
  //           likes: 6
  //         }
  //       ]
  //       blogs.forEach(blog => {
  //         const req = {
  //           method: 'POST',
  //           url: 'http://localhost:3003/api/blogs/',
  //           body: blog,
  //           headers: {
  //             authorization
  //           }
  //         }
  //         cy.request(req).then(response => console.log(response))
  //       })
  //       // Promise.all(promiseArray).then(response => console.log(response))
  //     })
  //   })

  // it('is in sorted order', function () {
  //   cy.contains('hopeful')
  // })
  // })