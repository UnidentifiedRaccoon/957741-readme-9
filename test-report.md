# 📋 Отчёт о тестировании проекта Readme

## 🎯 Общая информация

**Проект:** Readme - Headless движок для блога (микросервисная архитектура)  
**Дата тестирования:** 23 декабря 2025  
**Ветка:** module7-task1 (API Gateway)  
**Статус:** ✅ Анализ и рефакторинг API Gateway завершён

---

## 🏗️ Архитектура проекта

| Сервис | Порт | База данных | Описание |
|--------|------|-------------|----------|
| **api-gateway** | 4000 | - | Точка входа для фронтенда |
| **account-service** | 3001 | MongoDB:27017 | Аутентификация, пользователи |
| **content-service** | 3002 | PostgreSQL:5432 | Публикации, теги |
| **engage-service** | 3003 | PostgreSQL:5433 | Лайки, комментарии, подписки |
| **notify-service** | 3004 | MongoDB:27019 + RabbitMQ | Email рассылки |
| **storage-service** | 3005 | MongoDB:27018 | Загрузка файлов |

---

## 🔧 Проведённые исправления

### 1. Исправлены ошибки в конфигурации API Gateway

| Проблема | Решение |
|----------|---------|
| Неконсистентное именование `ApplicationServiceURL.Account` vs `Users` | Унифицировано на `Users` |
| Отсутствие Swagger документации | Добавлен `DocumentBuilder` и `SwaggerModule` в main.ts |
| Отсутствие `ValidationPipe` | Добавлена глобальная валидация DTO |

### 2. Добавлены недостающие контроллеры

| Контроллер | Файл | Описание |
|------------|------|----------|
| **UsersController** | `users.controller.ts` | Регистрация, логин, refresh, получение пользователя, смена пароля |
| **ContentController** | `content.controller.ts` | CRUD для постов, поиск, фид, репосты |
| **LikesController** | `engage.controller.ts` | Toggle лайка, проверка, подсчёт |
| **CommentsController** | `engage.controller.ts` | CRUD для комментариев |
| **SubscriptionsController** | `engage.controller.ts` | Подписки/отписки |
| **FilesController** | `files.controller.ts` | Загрузка/получение файлов |
| **NotifyController** | `notify.controller.ts` | Рассылка уведомлений |

### 3. Созданы DTO с валидацией

| DTO | Валидация |
|-----|-----------|
| `CreatePostDto` | Тип поста, заголовок 20-50 символов, теги (max 8, 3-10 символов каждый) |
| `UpdatePostDto` | Опциональные поля с теми же ограничениями |
| `CreateCommentDto` | Текст 10-300 символов |
| `ChangePasswordDto` | Пароль 6-12 символов |

### 4. Исправлены порты в .http файлах

| Библиотека | Старый порт | Новый порт |
|------------|-------------|------------|
| authentication | 3000 | 3001 |
| post-api | 3000 | 3002 |
| like-api | 3002 | 3003 |
| comment-api | 3002 | 3003 |
| subscription-api | 3002 | 3003 |
| file-uploader-api | 3000 | 3005 |

---

## 📝 API Gateway Endpoints

### Users (`/api/users`)
| Метод | Endpoint | Защита | Описание |
|-------|----------|--------|----------|
| POST | `/register` | Нет | Регистрация пользователя |
| POST | `/login` | Нет | Авторизация (получение JWT) |
| POST | `/refresh` | Bearer | Обновление токенов |
| GET | `/:id` | Bearer | Получение пользователя (+ статистика) |
| PATCH | `/password` | Bearer | Смена пароля |

### Blog (`/api/blog`)
| Метод | Endpoint | Защита | Описание |
|-------|----------|--------|----------|
| GET | `/` | Нет | Список публикаций (с фильтрами, пагинацией) |
| GET | `/search/:query` | Нет | Поиск по заголовку |
| GET | `/drafts` | Bearer | Черновики пользователя |
| GET | `/feed` | Bearer | Лента подписок |
| GET | `/:id` | Нет | Публикация по ID (+ лайки/комментарии) |
| POST | `/` | Bearer | Создание публикации |
| POST | `/:id/repost` | Bearer | Репост публикации |
| PATCH | `/:id` | Bearer | Редактирование публикации |
| DELETE | `/:id` | Bearer | Удаление публикации (каскадное) |

### Likes (`/api/likes`)
| Метод | Endpoint | Защита | Описание |
|-------|----------|--------|----------|
| POST | `/:postId` | Bearer | Toggle лайка |
| GET | `/:postId/count` | Нет | Количество лайков |
| GET | `/:postId/check` | Bearer | Проверка лайка |

### Comments (`/api/comments`)
| Метод | Endpoint | Защита | Описание |
|-------|----------|--------|----------|
| GET | `/:postId` | Нет | Список комментариев |
| POST | `/:postId` | Bearer | Создание комментария |
| GET | `/:postId/count` | Нет | Количество комментариев |
| DELETE | `/:commentId` | Bearer | Удаление комментария |

### Subscriptions (`/api/subscriptions`)
| Метод | Endpoint | Защита | Описание |
|-------|----------|--------|----------|
| POST | `/:userId` | Bearer | Подписаться на пользователя |
| DELETE | `/:userId` | Bearer | Отписаться от пользователя |
| GET | `/following` | Bearer | Список подписок |
| GET | `/followers` | Bearer | Список подписчиков |
| GET | `/:userId/followers/count` | Нет | Количество подписчиков |
| GET | `/:userId/check` | Bearer | Проверка подписки |

### Files (`/api/files`)
| Метод | Endpoint | Защита | Описание |
|-------|----------|--------|----------|
| POST | `/upload` | Bearer | Загрузка файла |
| GET | `/:fileId` | Нет | Получение файла |

### Notifications (`/api/notify`)
| Метод | Endpoint | Защита | Описание |
|-------|----------|--------|----------|
| POST | `/send` | Bearer | Рассылка уведомлений |

---

## ✅ Соответствие техническому заданию

### Требования к API Gateway (из задания):

| Требование | Статус | Комментарий |
|------------|--------|-------------|
| Создать в монорепозитории новый проект для API Gateway | ✅ | `apps/api-gateway` |
| Спроектировать REST API на основе макета и ТЗ | ✅ | Полный набор endpoints |
| API Gateway - слой представления данных | ✅ | Нет бизнес-логики, только проксирование |
| Трансформация данных | ✅ | Агрегация данных из нескольких сервисов |
| Аутентификация/авторизация | ✅ | `CheckAuthGuard` для защищённых endpoints |
| Подключить Swagger модуль | ✅ | Доступен на `http://localhost:4000/spec` |
| Расставить аннотации для документации | ✅ | `@ApiTags`, `@ApiOperation`, `@ApiResponse`, `@ApiBearerAuth` |

### Функциональность по ТЗ:

- [x] Регистрация новых пользователей (1.1-1.7)
- [x] Авторизация пользователей на основе JWT (1.8)
- [x] Смена пароля пользователя (1.9)
- [x] Детальная информация о пользователе (1.10)
- [x] Создание публикаций разных видов (2.4-2.9)
- [x] Редактирование публикаций (2.1-2.2)
- [x] Удаление публикаций с каскадным удалением комментариев (2.3)
- [x] Репост публикаций (2.13)
- [x] Детальная информация о публикации (2.14)
- [x] Список публикаций с пагинацией и сортировкой (3.1-3.6)
- [x] Фильтрация по типу и тегам (3.8, 3.11)
- [x] Черновики пользователя (3.9)
- [x] Лента пользователя (4.1-4.6)
- [x] Лайки к публикациям (5.1-5.3)
- [x] Комментарии к публикациям (6.1-6.6)
- [x] Рассылка уведомлений (7.1-7.5)
- [x] Поиск публикаций по названию (8.1-8.3)
- [x] Загрузка изображений (1.4, 2.8)

---

## 📂 Структура файлов API Gateway

```
apps/api-gateway/src/
├── main.ts                    # Entry point + Swagger setup
└── app/
    ├── app.module.ts          # Main module
    ├── app.config.ts          # Service URLs configuration
    ├── app.http               # HTTP requests for testing
    ├── users.controller.ts    # Users endpoints
    ├── content.controller.ts  # Blog/Posts endpoints
    ├── engage.controller.ts   # Likes, Comments, Subscriptions
    ├── files.controller.ts    # File upload/download
    ├── notify.controller.ts   # Notifications
    ├── dto/
    │   ├── create-post.dto.ts
    │   ├── update-post.dto.ts
    │   ├── create-comment.dto.ts
    │   └── change-password.dto.ts
    ├── guards/
    │   └── check-auth.guard.ts
    └── filters/
        └── axios-exception.filter.ts
```

---

## 🚀 Запуск и тестирование

### Запуск всех сервисов:
```bash
# Запуск инфраструктуры (MongoDB, PostgreSQL, RabbitMQ)
cd project
docker-compose -f apps/account-service/docker-compose.dev.yml up -d
docker-compose -f apps/content-service/docker-compose.dev.yml up -d
docker-compose -f apps/engage-service/docker-compose.dev.yml up -d
docker-compose -f apps/notify-service/notify-service.compose.dev.yml up -d
docker-compose -f apps/storage-service/storage-service.compose.dev.yml up -d

# Запуск сервисов
nx run account-service:serve
nx run content-service:serve
nx run engage-service:serve
nx run notify-service:serve
nx run storage-service:serve
nx run api-gateway:serve
```

### Swagger документация:
- API Gateway: http://localhost:4000/spec
- Account Service: http://localhost:3001/spec
- Content Service: http://localhost:3002/spec
- Engage Service: http://localhost:3003/spec

---

## 🎉 Заключение

**Статус проекта:** ✅ **API Gateway полностью реализован**

API Gateway успешно реализован как единая точка входа для фронтенда. Все endpoints покрыты Swagger документацией и защищены JWT авторизацией где требуется. Проект полностью соответствует техническому заданию модуля 7.
