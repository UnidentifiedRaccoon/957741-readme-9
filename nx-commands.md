# NX Команды для проекта

## Инициализация NX репозитория

```bash
npx create-nx-workspace@previous project --preset=nest
```
Инициализирует NX репозиторий с использованием NestJS preset

```bash
cd project
```
Переход в директорию проекта

```bash
npx nx add @nx/nest
```
Устанавливает генераторы для NestJS

## Создание приложений (Apps)

```bash
npx nx g @nx/nest:app apps/api-gateway
```
Создает NestJS приложение api-gateway

```bash
npx nx g @nx/nest:app apps/user-service
```
Создает NestJS приложение user-service

```bash
npx nx g @nx/nest:app apps/content-service
```
Создает NestJS приложение content-service

```bash
npx nx g @nx/nest:app apps/engage-service
```
Создает NestJS приложение engage-service

```bash
npx nx g @nx/nest:app apps/notify-service
```
Создает NestJS приложение notify-service

```bash
npx nx g @nx/nest:app apps/storage-service
```
Создает NestJS приложение storage-service

## Удаление проектов и e2e тестов

```bash
npx nx g @nx/workspace:remove project
```
Удаляет проект

```bash
npx nx g @nx/workspace:remove api-gateway-e2e
```
Удаляет e2e тесты для api-gateway

```bash
npx nx g @nx/workspace:remove user-service-e2e
```
Удаляет e2e тесты для user-service

```bash
npx nx g @nx/workspace:remove content-service-e2e
```
Удаляет e2e тесты для content-service

```bash
npx nx g @nx/workspace:remove engage-service-e2e
```
Удаляет e2e тесты для engage-service

```bash
npx nx g @nx/workspace:remove notify-service-e2e
```
Удаляет e2e тесты для notify-service

```bash
npx nx g @nx/workspace:remove storage-service-e2e
```
Удаляет e2e тесты для storage-service

## Управление кешем

```bash
npx nx reset
```
Сбрасывает кеши NX

## Генераторы NestJS компонентов

```bash
npx nx g @nx/nest:class apps/content-service/src/app/foo.ts
```
Генерирует класс в указанном пути

```bash
npx nx g @nx/nest:controller apps/content-service/src/app/foo.controller.ts
```
Генерирует контроллер NestJS

```bash
npx nx g @nx/nest:decorator apps/content-service/src/app/foo.decorator.ts
```
Генерирует декоратор NestJS

```bash
npx nx g @nx/nest:filter apps/content-service/src/app/foo
```
Генерирует фильтр исключений NestJS

```bash
npx nx g @nx/nest:gateway apps/content-service/src/app/foo
```
Генерирует WebSocket gateway NestJS

```bash
npx nx g @nx/nest:guard apps/content-service/src/app/foo.guard.ts
```
Генерирует guard NestJS

```bash
npx nx g @nx/nest:interceptor apps/content-service/src/app/foo
```
Генерирует interceptor NestJS

```bash
npx nx g @nx/nest:interface apps/content-service/src/app/foo
```
Генерирует интерфейс TypeScript

```bash
npx nx g @nx/nest:middleware apps/content-service/src/app/foo
```
Генерирует middleware NestJS

```bash
npx nx g @nx/nest:module apps/content-service/src/app/foo
```
Генерирует модуль NestJS

```bash
npx nx g @nx/nest:pipe apps/content-service/src/app/foo
```
Генерирует pipe NestJS

```bash
npx nx g @nx/nest:provider apps/content-service/src/app/foo
```
Генерирует провайдер NestJS

```bash
npx nx g @nx/nest:resolver apps/content-service/src/app/foo
```
Генерирует GraphQL resolver NestJS

```bash
npx nx g @nx/nest:resource apps/content-service/src/app/foo
```
Генерирует полный CRUD ресурс (модуль + контроллер + сервис + DTOs)

```bash
npx nx g @nx/nest:service apps/content-service/src/app/foo
```
Генерирует сервис NestJS
