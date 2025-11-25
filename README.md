# AI_BE_dev

Backend para **Reto AI**. API REST en TypeScript con Express.  
Incluye endpoints de autenticación, tests con Jest + Supertest y despliegue con Serverless.

---

## Tabla de contenidos
- [Requisitos](#requisitos)
- [Instalación](#instalación)
- [Comandos útiles](#comandos-útiles)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Variables de entorno](#variables-de-entorno)
- [Testing](#testing)
- [Mocks en tests / Uso local](#mocks-en-tests--uso-local)
- [Serverless (breve)](#serverless-breve)
- [Problemas comunes / Troubleshooting](#problemas-comunes--troubleshooting)
- [Futuras mejoras / TODO](#futuras-mejoras--todo)

---

## Requisitos
- Node >= 18 (recomendado)
- npm (o yarn)
- (opcional) DynamoDB local si querés probar integración con AWS sin tocar la nube
- (opcional) `serverless` CLI para deploy: `npm i -g serverless`

---

## Instalación

```bash
# clonar repo
git clone <repo-url>
cd AI_BE_dev

# instalar dependencias
npm install
```

## Comandos útiles

### Desarrollo (levanta watcher para TS)
```bash
npm run dev
```

### Compilar TypeScript (!! antes de deploy !!)
```bash
npm run build
```

### Ejecutar tests (Jest + ts-jest)
```bash
npx jest
# o
npm test
``` 

### Deploy con Serverless (según serverless.yml)
```bash
npx serverless deploy --stage dev
```

### Remover deployment
```bash
npx serverless remove --stage dev
```

### Ejecutar DynamoDB local
```bash
# Modo detached (segundo plano) - recomendado
docker run -d -p 8000:8000 amazon/dynamodb-local
```

```bash
# Ver contenedores corriendo
docker ps
```

```bash
# Detener el contenedor
docker stop <container_id>
```

## DynamoDB con entorno local

### Crear tabla users 
```bash
aws dynamodb create-table \
    --table-name dev-users \
    --attribute-definitions AttributeName=id,AttributeType=S AttributeName=email,AttributeType=S \
    --key-schema AttributeName=id,KeyType=HASH \
    --global-secondary-indexes "IndexName=email-index,KeySchema=[{AttributeName=email,KeyType=HASH}],Projection={ProjectionType=ALL}" \
    --billing-mode PAY_PER_REQUEST \
    --endpoint-url http://localhost:8000
```

### Insertar un usuario de prueba
```bash
aws dynamodb put-item \
    --table-name dev-users \
    --item '{
        "id": {"S": "1"},
        "email": {"S": "test@example.com"},
        "passwordHash": {"S": "$2b$10$GqzEG114O6tGw3zP8Pl1Tu41j2lfWVxHzLbNQMfYu8xi.Gv0D5wTq"},
        "roleId": {"S": "2"}
    }' \
    --endpoint-url http://localhost:8000
```

### Crear tabla roles
```bash
aws dynamodb create-table \
    --table-name dev-roles \
    --attribute-definitions AttributeName=id,AttributeType=S \
    --key-schema AttributeName=id,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --endpoint-url http://localhost:8000
```

### Insertar un rol de prueba (admin)
```bash
aws dynamodb put-item \
    --table-name dev-roles \
    --item '{
        "id": {"S": "1"},
        "name": {"S": "admin"}
    }' \
    --endpoint-url http://localhost:8000
```

### Insertar un rol de prueba (personal)
```bash
aws dynamodb put-item \
    --table-name dev-roles \
    --item '{
        "id": {"S": "2"},
        "name": {"S": "personal"}
    }' \
    --endpoint-url http://localhost:8000
```

### Borrar tabla users
```bash
aws dynamodb delete-table \
    --table-name dev-users \
    --endpoint-url http://localhost:8000
```

### Borrar tabla roles
```bash
aws dynamodb delete-table \
    --table-name dev-roles \
    --endpoint-url http://localhost:8000
```