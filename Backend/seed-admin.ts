import bcrypt from 'bcryptjs';
import { sequelize, UserModel } from './src/models';
import dotenv from 'dotenv';
import logger from './src/utils/logger';

dotenv.config();

async function seed() {
  try {
    await sequelize.authenticate();
    logger.info('Connected to database to seed admin user...');

    const email = 'owner@yourdomain.com';
    const password = 'securePassword123';

    const existingUser = await UserModel.findOne({ where: { email } });
    if (existingUser) {
      logger.info(`Admin user with email ${email} already exists. Skipping seeding.`);
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await UserModel.create({
      name: 'Adarsh Sharma',
      email,
      passwordHash,
      role: 'admin',
    });

    logger.info('Admin account seeded successfully!');
    logger.info(`Email: ${email}`);
    logger.info(`Password: ${password}`);
  } catch (error: any) {
    logger.error('Failed to seed admin user:', error);
  } finally {
    await sequelize.close();
  }
}

seed();
