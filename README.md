# AI_BE_dev

Backend for the **AI Challenge**.  
REST API built with **TypeScript**, **Express** and **DynamoDB** (AWS SDK v3).

---

## 📌 Base URL

**Production / Dev:**  
https://foqbbmku8j.execute-api.us-east-1.amazonaws.com/api/v1

---

## 📃​ Open API/Swagger Documentation

https://app.swaggerhub.com/apis/ASKINGLUCHO/restful-api/1.0.0#/

## 📌 Endpoints to validate

### **Auth**

| Method | Endpoint  | Description                           |
| ------ | --------- | ------------------------------------- |
| POST   | `/login`  | Login user ( body: email + password ) |
| POST   | `/logout` | Logout user ( body: token )           |

### **Endpoints with role "personal"**

| Method | Endpoint                     | Description                     |
| ------ | ---------------------------- | ------------------------------- |
| GET    | `/me`                        | Get user info from external API |
| GET    | `/me/posts`                  | Get user posts                  |
| GET    | `/me/posts/:postId`          | Get user post                   |
| GET    | `/me/posts/:postId/comments` | Get user post comments          |

### **Endpoints with role "admin"**

| Method | Endpoint               | Description                                   |
| ------ | ---------------------- | --------------------------------------------- |
| POST   | `/roles`               | Create role ( body: admin or personal )       |
| GET    | `/roles`               | List available roles                          |
| GET    | `/roles/:roleId`       | Get role                                      |
| POST   | `/users`               | Create user ( body: email + role + password ) |
| GET    | `/users`               | Get all users                                 |
| GET    | `/users/:userId`       | Get user                                      |
| GET    | `/posts`               | Get all posts                                 |
| GET    | `/posts/:postId`       | Get post                                      |
| GET    | `/comments`            | Get all comments                              |
| GET    | `/comments/:commentId` | Get comment                                   |
| POST   | `/comment/analytics`   | Get sentiment analysis                        |

> All protected endpoints require header:  
> `Authorization: Bearer <token>`

---

## 🚀 Installation

```bash
git clone <repo-url>
cd AI_BE_dev
npm install
```

## 🔧 Main Scripts

```bash
npm run dev      # Development with ts-node + watcher
npm run build    # Compile to JS
npm test         # Tests Jest + Supertest
npm run deploy   # Deploy to AWS
```

## 🔐 Environment Variables

Create a .env file in the root:

```bash
AWS_REGION=us-east-1
BEDROCK_API_KEY=replace_with_real_key
BEDROCK_MODEL_ID=anthropic.claude-3-haiku-20240307-v1:0
DYNAMO_TABLE_USERS=dev-users
DYNAMO_TABLE_ROLES=dev-roles
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=24h
NODE_ENV=dev
IS_LOCAL=true  # True to local development
```

## 📁 Project Structure

```bash
src/
  adapters/
  controllers/
  handlers/
  lib/
  middleware/
  repositories/
  routes/
  services/
tests/
  helpers/
  integration/
  unit/
```

# 🗄️ Local DynamoDB (optional)

### 📌 Base URL

**Localhost:**  
http://localhost:3000/api/v1

### 📌 Start docker with local dynamodb:

```
docker run -d -p 8000:8000 amazon/dynamodb-local
```

## Create tables:

```
aws dynamodb create-table \
 --table-name dev-users \
 --attribute-definitions AttributeName=id,AttributeType=S AttributeName=email,AttributeType=S \
 --key-schema AttributeName=id,KeyType=HASH \
 --global-secondary-indexes "IndexName=email-index,KeySchema=[{AttributeName=email,KeyType=HASH}],Projection={ProjectionType=ALL}" \
 --billing-mode PAY_PER_REQUEST \
 --endpoint-url http://localhost:8000
```

```
aws dynamodb create-table \
 --table-name dev-roles \
 --attribute-definitions AttributeName=id,AttributeType=S \
 --key-schema AttributeName=id,KeyType=HASH \
 --billing-mode PAY_PER_REQUEST \
 --endpoint-url http://localhost:8000
```

# Insert initial data:

### Admin role

```
aws dynamodb put-item \
 --table-name dev-roles \
 --item '{"id":{"S":"1"},"name":{"S":"admin"}}' \
 --endpoint-url http://localhost:8000
```

### Personal role

```
aws dynamodb put-item \
 --table-name dev-roles \
 --item '{"id":{"S":"2"},"name":{"S":"personal"}}' \
 --endpoint-url http://localhost:8000
```
