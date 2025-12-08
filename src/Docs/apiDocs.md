# API Docs - myfinalproject-backend

Base URL: `/api`

## Auth
- POST `/api/users/register` { name, email, password, role? }
- POST `/api/users/login` { email, password }
- GET `/api/users/profile` (Bearer token)

## Products
- GET `/api/products?keyword=&page=&limit=`
- GET `/api/products/:id`
- POST `/api/products` (admin)
- PUT `/api/products/:id` (admin)
- DELETE `/api/products/:id` (admin)

## Orders
- POST `/api/orders` (create order) - protected
- GET `/api/orders/myorders` - protected
- GET `/api/orders/:id` - protected (owner/admin)
- PUT `/api/orders/:id/pay` - protected
- GET `/api/orders` - admin

## Payments
- POST `/api/payments/users` - create user payment record
- GET `/api/payments/users/:userId` - list user's payments
- POST `/api/payments/suppliers` - admin create supplier payment
- GET `/api/payments/suppliers` - admin list

## Feedback
- POST `/api/feedback` - protected
- GET `/api/feedback/product/:productId`

