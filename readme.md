# Ecommerce Server Plan

- /seed -> seeding some data in databse

- /api/users (D)

  - POST /register -> create the user account with email(optional), phone, password
  - POST /activate -> activate the user account
  - GET /profile -> Get user profile
  - PUT /:id -> Update user account
  - DELETE /:id -> delete user account(Admin)
  - PUT /reset-password/:id -> reset password
  - POST /forgot-password -> forgot password
  - PUT /ban/:id -> ban the user account(Admin)
  - PUT /unban/:id -> unban the user(Admin)
  - GET /export-user -> export all the users(Admin)
  - GET /all-users -> get all users with search & pagination

- /api/auth (Jwt Auth)

  - POST /login -> isLoggedOut -> user login
  - GET /logout -> isLoggedIn -> user logout
  - GET /refresh -> get refresh token

- Middelware

  - isLoggedIn
  - isLoggedOut
  - isAdmin
  - uploadFiles
  - getRefreshToken
  - validatior

- /api/categories (CRUD)

  - POST / -> Create the category(Admin)
  - GET / -> get all category(Admin)
  - POST / -> create a category(Admin)
  - PUT /:id -> update category(Admin)
  - DELETE /:id -> delete a category(Admin)

- /api/products (CRUD)

  - POST / -> Create a product(Admin)
  - GET / -> Get all products
  - GET /:id -> Get single product
  - PUT /:id -> Update a product(Admin)
  - DELETE /:id -> Delete a product(Admin)

- /api/orders (CRUD)

  - POST / -> create a order(user/Admin)
  - GET / -> get the order(user/Admin)
  - GET /all-order -> get all order(Admin)
  - DELETE /:id -> delete an order(Admin)
  - PUT /:id -> updated a order status(Admin)

- /api/payment

  - GET /token -> get the payment token(user/admin)
  - POST /process-payment -> process payment(user/Admin)
