import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(__dirname, '../.env') });

import { PrismaClient } from '../generated/prisma/client';

const FIRST_LIKE_UUID = 'f1a2b3c4-d5e6-7890-abcd-ef1234567890';
const SECOND_LIKE_UUID = 'f2b3c4d5-e6f7-8901-bcde-f12345678901';
const THIRD_LIKE_UUID = 'f3c4d5e6-f7a8-9012-cdef-123456789012';

const FIRST_COMMENT_UUID = 'c1a2b3c4-d5e6-7890-abcd-ef1234567890';
const SECOND_COMMENT_UUID = 'c2b3c4d5-e6f7-8901-bcde-f12345678901';
const THIRD_COMMENT_UUID = 'c3c4d5e6-f7a8-9012-cdef-123456789012';

const FIRST_SUBSCRIPTION_UUID = 's1a2b3c4-d5e6-7890-abcd-ef1234567890';
const SECOND_SUBSCRIPTION_UUID = 's2b3c4d5-e6f7-8901-bcde-f12345678901';

const FIRST_POST_UUID = '6d308040-96a2-4162-bea6-2338e9976540';
const SECOND_POST_UUID = 'ab04593b-da99-4fe3-8b4b-e06d82e2efdd';

const FIRST_USER_ID = '658170cbb954e9f5b905ccf4';
const SECOND_USER_ID = '6581762309c030b503e30512';
const THIRD_USER_ID = '6581762309c030b503e30513';

function getLikes() {
  return [
    { id: FIRST_LIKE_UUID, postId: FIRST_POST_UUID, userId: FIRST_USER_ID },
    { id: SECOND_LIKE_UUID, postId: FIRST_POST_UUID, userId: SECOND_USER_ID },
    { id: THIRD_LIKE_UUID, postId: SECOND_POST_UUID, userId: FIRST_USER_ID },
  ];
}

function getComments() {
  return [
    {
      id: FIRST_COMMENT_UUID,
      postId: FIRST_POST_UUID,
      userId: SECOND_USER_ID,
      text: 'Отличная статья! Очень полезно для начинающих.',
    },
    {
      id: SECOND_COMMENT_UUID,
      postId: FIRST_POST_UUID,
      userId: THIRD_USER_ID,
      text: 'Спасибо за материал, буду ждать продолжения.',
    },
    {
      id: THIRD_COMMENT_UUID,
      postId: SECOND_POST_UUID,
      userId: SECOND_USER_ID,
      text: 'Node.js действительно упрощает разработку!',
    },
  ];
}

function getSubscriptions() {
  return [
    { id: FIRST_SUBSCRIPTION_UUID, followerId: SECOND_USER_ID, followingId: FIRST_USER_ID },
    { id: SECOND_SUBSCRIPTION_UUID, followerId: THIRD_USER_ID, followingId: FIRST_USER_ID },
  ];
}

async function seedDb(prismaClient: PrismaClient) {
  const mockLikes = getLikes();
  for (const like of mockLikes) {
    await prismaClient.like.upsert({
      where: { id: like.id },
      update: {},
      create: {
        id: like.id,
        postId: like.postId,
        userId: like.userId,
      },
    });
  }

  const mockComments = getComments();
  for (const comment of mockComments) {
    await prismaClient.comment.upsert({
      where: { id: comment.id },
      update: {},
      create: {
        id: comment.id,
        postId: comment.postId,
        userId: comment.userId,
        text: comment.text,
      },
    });
  }

  const mockSubscriptions = getSubscriptions();
  for (const subscription of mockSubscriptions) {
    await prismaClient.subscription.upsert({
      where: { id: subscription.id },
      update: {},
      create: {
        id: subscription.id,
        followerId: subscription.followerId,
        followingId: subscription.followingId,
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
