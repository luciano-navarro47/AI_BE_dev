# AI_BE_dev

Backend para el **Reto AI**.  
API REST construida con **TypeScript**, **Express** y **DynamoDB** (AWS SDK v3).

---

## 📌 Base URL

**Producción / Dev:**  
`https://foqbbmku8j.execute-api.us-east-1.amazonaws.com/api/v1`  
_(Ejemplo: `https://abcd1234.execute-api.us-east-1.amazonaws.com/api/v1`)_

---

## 📃​ Documentación Open API/Swagger

`https://app.swaggerhub.com/apis/ASKINGLUCHO/restful-api/1.0.0#/`

## 📌 Endpoints a validar

### **Auth**

| Método | Endpoint  | Descripción                               |
| ------ | --------- | ----------------------------------------- |
| POST   | `/login`  | Logear usuario ( body: email + password ) |
| POST   | `/logout` | Deslogear usuario ( body: token )         |

### **Endpoints con role "personal"**

| Método | Endpoint                     | Descripción                              |
| ------ | ---------------------------- | ---------------------------------------- |
| GET    | `/me`                        | Obtiene info del usuario de API externa  |
| GET    | `/me/posts`                  | Obtiene posts del usuario                |
| GET    | `/me/posts/:postId`          | Obtiene post del usuario                 |
| GET    | `/me/posts/:postId/comments` | Obtiene comentarios del post del usuario |

### **Endpoints con role "admin"**

| Método | Endpoint               | Descripción                                     |
| ------ | ---------------------- | ----------------------------------------------- |
| POST   | `/roles`               | Crear role ( body: admin o personal )           |
| GET    | `/roles`               | Lista roles disponibles                         |
| GET    | `/roles/:roleId`       | Obtiene role                                    |
| POST   | `/users`               | Crear usuario ( body: email + role + password ) |
| GET    | `/users`               | Obtiene todos los usuarios                      |
| GET    | `/users/:userId`       | Obtiene el usuario                              |
| GET    | `/posts`               | Obtiene todos los posts                         |
| GET    | `/posts/:postId`       | Obtiene el post                                 |
| GET    | `/comments`            | Obtiene todos los comentarios                   |
| GET    | `/comments/:commentId` | Obtiene el comentario                           |
| POST   | `/comment/analytics`   | Obtiene analisis de sentimientos                |

> Todos los endpoints protegidos requieren header:  
> `Authorization: Bearer <token>`

---

## 🚀 Instalación

```bash
git clone <repo-url>
cd AI_BE_dev
npm install
```

## 🔧 Scripts principales

```bash
npm run dev      # Desarrollo con ts-node + watcher
npm run build    # Compilar a JS
npm test         # Tests Jest + Supertest
npm run deploy   # Deploy a AWS
```

## 🔐 Variables de entorno

Crear un archivo .env en la raíz:

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

## 📁 Estructura del proyecto

```bash
src/
  adapters/
  controllers/
  lib/
  middleware/
  repositories/
  routes/
  services/
tests/
  auth/
```

# 🗄️ DynamoDB local (opcional)

### 📌 Base URL

**Localhost:**  
`http://localhost:3000/api/v1`

### 📌 Levantar docker con dynamodb local:

```
docker run -d -p 8000:8000 amazon/dynamodb-local
```

## Crear tablas:

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

# Insertar datos iniciales:

### Rol admin

```
aws dynamodb put-item \
 --table-name dev-roles \
 --item '{"id":{"S":"1"},"name":{"S":"admin"}}' \
 --endpoint-url http://localhost:8000
```

### Rol personal

```
aws dynamodb put-item \
 --table-name dev-roles \
 --item '{"id":{"S":"2"},"name":{"S":"personal"}}' \
 --endpoint-url http://localhost:8000
```
