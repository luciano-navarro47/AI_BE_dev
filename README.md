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

### Compilar TypeScript
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
docker run -p 8000:8000 amazon/dynamodb-local

