# 🛍️ eCommerce Website

A fully functional eCommerce platform that supports both user and admin operations, including product browsing, cart management, secure checkout, and order processing. Designed with scalability, usability, and maintainability in mind.

---
## 🚀 Features

### User-Side
- Browse products by category
- Add/remove items from the cart
- Secure checkout and order confirmation
- Add Reviews and feedbacks

### Admin-Side
- Product management (CRUD)
- Dashboard with key metrics

### System Features
- User authentication & authorization
- RESTful API architecture
- White-box testing for all critical components
- Test coverage reporting


## Set up
Once you clone this repository, please do the following commands on terminal.

You might need to install postgres with 'npm install postgres'
Add this into your devcontainer.json file and rebuild the container:

"features": {
"ghcr.io/robbert229/devcontainer-features/postgresql-client:1": {
"version": "15"
}

After your container is rebuilt and set up,

log into postgres with the command psql -h localhost -U postgres -d postgres
make sure you run the migration file : node config/migrationRunner.js migrate

# Note: 
You will need a server to host the database. Otherwise, it will not shows the products page

## Run your app

Once you have the environment setup, please do the following commands on terminal.

```
npm install
npm start
```

---

## 🧪 Testing

To run the test suite and generate coverage reports:

```
node test
node --test --experimental-test-coverage
```

## Tech Stack
- Node.js
- Express.js
- PostgreSQL
- HTML/CSS/JS
- Mocha
- Docker
