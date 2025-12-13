import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(__dirname, '../../../../apps/account-service/account-service.env') });

import mongoose from 'mongoose';
import { genSalt, hash } from 'bcrypt';
import { getMongoConnectionString } from '@project/helpers';

const SALT_ROUNDS = 10;

const FIRST_USER_ID = '658170cbb954e9f5b905ccf4';
const SECOND_USER_ID = '6581762309c030b503e30512';
const THIRD_USER_ID = '6581762309c030b503e30513';

interface SeedUser {
  _id: mongoose.Types.ObjectId;
  email: string;
  firstname: string;
  lastname: string;
  dateOfBirth: Date;
  avatar: string;
  password: string;
}

function getUsers(): SeedUser[] {
  return [
    {
      _id: new mongoose.Types.ObjectId(FIRST_USER_ID),
      email: 'user@notfound.local',
      firstname: 'Keks',
      lastname: 'Smith',
      dateOfBirth: new Date('2012-02-22'),
      avatar: '',
      password: '123456',
    },
    {
      _id: new mongoose.Types.ObjectId(SECOND_USER_ID),
      email: 'alice@example.com',
      firstname: 'Alice',
      lastname: 'Johnson',
      dateOfBirth: new Date('1995-08-20'),
      avatar: '',
      password: 'qwerty',
    },
    {
      _id: new mongoose.Types.ObjectId(THIRD_USER_ID),
      email: 'bob@example.com',
      firstname: 'Bob',
      lastname: 'Williams',
      dateOfBirth: new Date('1988-03-15'),
      avatar: '',
      password: 'password123',
    },
  ];
}

async function hashPassword(password: string): Promise<string> {
  const salt = await genSalt(SALT_ROUNDS);
  return hash(password, salt);
}

// Schema matches BlogUserModel from blog-user.model.ts
const BlogUserSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, required: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    avatar: { type: String, default: '' },
    passwordHash: { type: String, required: true },
  },
  {
    collection: 'accounts',
    timestamps: true,
  }
);

async function seedDb(connection: mongoose.Connection) {
  const UserModel = connection.model('BlogUser', BlogUserSchema);
  const mockUsers = getUsers();

  for (const user of mockUsers) {
    const passwordHash = await hashPassword(user.password);

    await UserModel.findOneAndUpdate(
      { _id: user._id },
      {
        _id: user._id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        dateOfBirth: user.dateOfBirth,
        avatar: user.avatar,
        passwordHash,
      },
      { upsert: true, new: true }
    );
  }

  console.info('🤘️ Database was filled');
}

async function bootstrap() {
  const connectionString = getMongoConnectionString({
    username: process.env['MONGO_USER'] ?? '',
    password: process.env['MONGO_PASSWORD'] ?? '',
    host: process.env['MONGO_HOST'] ?? 'localhost',
    port: parseInt(process.env['MONGO_PORT'] ?? '27017', 10),
    databaseName: process.env['MONGO_DB'] ?? '',
    authDatabase: process.env['MONGO_AUTH_BASE'] ?? 'admin',
  });

  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(connectionString);
    console.log('Connected successfully');

    await seedDb(mongoose.connection);

    console.log('\nSeeded users:');
    const users = getUsers();
    for (const user of users) {
      console.log(`  - ${user.email} (password: ${user.password}) - ID: ${user._id.toString()}`);
    }

    globalThis.process.exit(0);
  } catch (error: unknown) {
    console.error(error);
    globalThis.process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

bootstrap();
