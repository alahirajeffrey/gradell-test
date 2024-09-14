## Gradell Senior Backend Engineer Assessment

This repo contains code to Gradell Senior Backend Engineer Assessment.

### Requirements

- [Nodejs](https://nodejs.org/en/) is a JavaScript runtime built on Chrome's V8 JavaScript engine. Is is a cross-platform, open-source JavaScript runtime environment that can run on Windows, Linux, Unix, macOS, and more.

- [Docker-compose](https://docs.docker.com/compose/) is a tool for defining and running multi-container applications. simplifies the control of your entire application stack, making it easy to manage services, networks, and volumes in a single, comprehensible YAML configuration file. Then, with a single command, you create and start all the services from your configuration file.

### How to Run

- Open your terminal and clone the repository using the command `git clone https://github.com/alahirajeffrey/gradell-test.git`
- Navigate into the cloned repository using `cd gradell-test`
- Create a `.env` file in each of the services and populate using the `.env.example` file
- Run the command `docker compose up -d` to use docker to start the application in detached mode

### Endpoints

#### **Register a New User**

**URL:** `localhost:3000/api/register`

**Method:** `POST`

**Description:** Register a new user.

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### **Login User**

**URL:** `localhost:3000/api/login`

**Method:** `POST`

**Description:** Login a user.

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### **Create Product**

**URL:** `localhost:3000/api/product`

**Method:** `POST`

**Description:** Create a product.

**Request Body:**

```json
{
  "name": "Iphone 16",
  "price": 50000,
  "description": "White Iphone 16 pro max",
  "quantity: 100
}
```

#### **Get all Products**

**URL:** `localhost:3000/api/product`

**Method:** `GET`

**Description:** Get all products.

**Request Body:**

```json
{}
```

#### **Get Product by Id**

**URL:** `localhost:3000/api/product/:productId`

**Method:** `GET`

**Description:** Get product by id.

**Request Body:**

```json
{
  "productId": "x12me14"
}
```

#### **Create Order**

**URL:** `localhost:3000/api/order`

**Method:** `POST`

**Description:** Create an order.

**Request Body:**

```json
{
  "totalCost": 15000,
  "deliveryAddress": "Maitama Abuja",
  "products": ["xawaed134", "xnn134ao"]
}
```

#### **Get Order by Id**

**URL:** `localhost:3000/api/order/:orderId`

**Method:** `GET`

**Description:** Get order by id.

**Request Body:**

```json
{
  "orderId": "x12me14"
}
```

#### **Pay for an order**

**URL:** `localhost:3000/api/payment`

**Method:** `POST`

**Description:** Pay for an ordr.

**Request Body:**

```json
{
  "orderId": "x12me14",
  "amount": 50000
}
```

#### **Pay for an order**

**URL:** `localhost:3000/api/payment`

**Method:** `POST`

**Description:** Pay for an order.

**Request Body:**

```json
{
  "orderId": "ccw1351",
  "amount": 50000
}
```
