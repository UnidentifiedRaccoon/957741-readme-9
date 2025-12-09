import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(__dirname, '../.env') });

import { PrismaClient } from '../generated/prisma/client';

const FIRST_TAG_UUID = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
const SECOND_TAG_UUID = 'b2c3d4e5-f6a7-8901-bcde-f12345678901';
const THIRD_TAG_UUID = 'c3d4e5f6-a7b8-9012-cdef-123456789012';

const FIRST_POST_UUID = '6d308040-96a2-4162-bea6-2338e9976540';
const SECOND_POST_UUID = 'ab04593b-da99-4fe3-8b4b-e06d82e2efdd';
const THIRD_POST_UUID = 'd4e5f6a7-b8c9-0123-def0-234567890123';
const FOURTH_POST_UUID = 'e5f6a7b8-c9d0-1234-ef01-345678901234';

const FIRST_USER_ID = '658170cbb954e9f5b905ccf4';
const SECOND_USER_ID = '6581762309c030b503e30512';

function getTags() {
  return [
    { id: FIRST_TAG_UUID, name: 'javascript' },
    { id: SECOND_TAG_UUID, name: 'nodejs' },
    { id: THIRD_TAG_UUID, name: 'tutorial' },
  ];
}

function getPosts() {
  return [
    {
      id: FIRST_POST_UUID,
      type: 'TEXT' as const,
      status: 'PUBLISHED' as const,
      userId: FIRST_USER_ID,
      title: 'Изучаем JavaScript',
      extraFields: {
        text: 'JavaScript — это мультипарадигменный язык программирования, который поддерживает объектно-ориентированный, функциональный и событийно-ориентированный стили.',
        announcement: 'Базовое введение в JavaScript для начинающих разработчиков.',
      },
      tags: {
        connect: [{ id: FIRST_TAG_UUID }, { id: THIRD_TAG_UUID }],
      },
    },
    {
      id: SECOND_POST_UUID,
      type: 'TEXT' as const,
      status: 'PUBLISHED' as const,
      userId: FIRST_USER_ID,
      title: 'Node.js для backend разработки',
      extraFields: {
        text: 'Node.js позволяет использовать JavaScript на сервере. Это открывает возможности для fullstack разработки на одном языке.',
        announcement: 'Почему Node.js отлично подходит для серверной разработки.',
      },
      tags: {
        connect: [{ id: FIRST_TAG_UUID }, { id: SECOND_TAG_UUID }],
      },
    },
    {
      id: THIRD_POST_UUID,
      type: 'QUOTE' as const,
      status: 'PUBLISHED' as const,
      userId: SECOND_USER_ID,
      title: 'Цитата дня',
      extraFields: {
        text: 'Любая достаточно сложная программа содержит заново написанную, неспецифицированную, глючную и медленную реализацию половины Common Lisp.',
        author: 'Филип Гринспан',
      },
    },
    {
      id: FOURTH_POST_UUID,
      type: 'LINK' as const,
      status: 'DRAFT' as const,
      userId: SECOND_USER_ID,
      title: 'Полезная ссылка на документацию',
      extraFields: {
        url: 'https://developer.mozilla.org/ru/docs/Web/JavaScript',
        description: 'MDN Web Docs — отличный ресурс для изучения JavaScript.',
      },
      tags: {
        connect: [{ id: FIRST_TAG_UUID }],
      },
    },
  ];
}

async function seedDb(prismaClient: PrismaClient) {
  const mockTags = getTags();
  for (const tag of mockTags) {
    await prismaClient.tag.upsert({
      where: { id: tag.id },
      update: {},
      create: {
        id: tag.id,
        name: tag.name,
      },
    });
  }

  const mockPosts = getPosts();
  for (const post of mockPosts) {
    await prismaClient.post.upsert({
      where: { id: post.id },
      update: {},
      create: {
        id: post.id,
        type: post.type,
        status: post.status,
        userId: post.userId,
        title: post.title,
        extraFields: post.extraFields,
        tags: post.tags,
      },
    });
  }

  console.info('🤘️ Database was filled');
}

async function bootstrap() {
  const prismaClient = new PrismaClient();

  try {
    await seedDb(prismaClient);
    globalThis.process.exit(0);
  } catch (error: unknown) {
    console.error(error);
    globalThis.process.exit(1);
  } finally {
    await prismaClient.$disconnect();
  }
}

bootstrap();
