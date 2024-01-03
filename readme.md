# Ecommerce Server Plan

- /seed -> seeding some data in databse

- /api/users (D)

  - POST /register -> create the user account with email(optional), phone, password
  - POST /activate -> activate the user account
  - GET /profile -> Get user profile
  - PUT /:id -> Update user account
  - PUT /reset-password/:id -> reset password
  - POST /forgot-password -> forgot password
  - GET /all-users -> get all users with search & pagination

- /api/auth (Jwt Auth)

  - POST /login -> isAuthenticted -> isUserLogin
  - GET /logout -> user logout
  - GET /refresh -> get refresh token

- Middelware

  - isAuthenticated
  - authorizeUser
  - uploadFiles
  - validatior

- /api/category (CRUD)

  - POST / -> Create the category(Admin)
  - GET / -> get all category(Admin)
  - POST / -> create a category(Admin)
  - PUT /:id -> update category(Admin)
  - DELETE /:id -> delete a category(Admin) -- if delete category also delete subcategory

- /api/subCateogry (CRUD)

  - POST / -> Create the subcategory(Admin)
  - GET / -> get all subcategory(Admin)
  - POST / -> create a subcategory(Admin)
  - PUT /:id -> update subcategory(Admin)
  - DELETE /:id -> delete a subcategory(Admin)

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
