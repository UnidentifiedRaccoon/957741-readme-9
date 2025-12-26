# Инструкции по запуску проекта

### Требования

- Node.js 20.x LTS
- Docker и Docker Compose
- npm 10.x

### Установка зависимостей

```bash
cd project
npm install
```

### Запуск баз данных

Для запуска MongoDB (account-service):

```bash
cd project/apps/account-service
docker compose -f docker-compose.dev.yml up -d
```

Для запуска PostgreSQL (content-service):

```bash
cd project/apps/content-service
docker compose -f docker-compose.dev.yml up -d
```

Для запуска PostgreSQL (engage-service):

```bash
cd project/apps/engage-service
docker compose -f docker-compose.dev.yml up -d
```

Для запуска RabbitMQ и MongoDB (notify-service):

```bash
cd project/apps/notify-service
docker compose -f notify-service.compose.dev.yml up -d
```

Для запуска MongoDB (storage-service):

```bash
cd project/apps/storage-service
docker compose -f storage-service.compose.dev.yml up -d
```

### Переменные окружения

Создайте файлы `.env` для каждого сервиса на основе **.env:** примеров:


### Генерация Prisma Client и миграции

Для content-service:

```bash
cd project/libs/content/models
npx prisma generate
npx prisma migrate dev
```

Для engage-service:

```bash
cd project/libs/engage/models
npx prisma generate
npx prisma migrate dev
```

**Примечание:** Перед запуском миграций убедитесь, что PostgreSQL контейнеры запущены и переменные окружения настроены корректно.

### Запуск сервисов

Запуск всех сервисов:

```bash
cd project
npx nx run-many --target=serve --all
```

Или запуск отдельных сервисов:

```bash
npx nx serve account-service
npx nx serve content-service
npx nx serve engage-service
npx nx serve notify-service
npx nx serve storage-service
npx nx serve api-gateway
```

### API документация

После запуска API Gateway документация Swagger доступна по адресу:
- http://localhost:3000/api (API Gateway)

### Линтинг

```bash
cd project
npx nx run-many --target=lint --all
```

### Сборка проекта

```bash
cd project
npx nx run-many --target=build --all
```

---