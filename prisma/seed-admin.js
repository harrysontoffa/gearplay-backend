const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const USERNAME = 'admin';
const PASSWORD = 'gearplay2026';  // change-le si tu veux, retiens-le bien

async function main() {
  const passwordHash = await bcrypt.hash(PASSWORD, 10);
  await prisma.admin.upsert({
    where: { username: USERNAME },
    update: { passwordHash },
    create: { username: USERNAME, passwordHash },
  });
  console.log('✓ Admin créé/mis à jour');
  console.log('  username :', USERNAME);
  console.log('  password :', PASSWORD);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());