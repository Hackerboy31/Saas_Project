const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  // Create tenants
  const acme = await prisma.tenant.create({
    data: {
      name: "Acme",
      slug: "acme",
      plan: "FREE",
    },
  });

  const globex = await prisma.tenant.create({
    data: {
      name: "Globex",
      slug: "globex",
      plan: "FREE",
    },
  });

  // Create users (password = "password")
  const passwordHash = await bcrypt.hash("password", 10);

  await prisma.user.createMany({
    data: [
      { email: "admin@acme.test", role: "ADMIN", tenantId: acme.id, password: passwordHash },
      { email: "user@acme.test", role: "MEMBER", tenantId: acme.id, password: passwordHash },
      { email: "admin@globex.test", role: "ADMIN", tenantId: globex.id, password: passwordHash },
      { email: "user@globex.test", role: "MEMBER", tenantId: globex.id, password: passwordHash },
    ],
  });
}

main()
  .then(() => {
    console.log("🌱 Database seeded successfully!");
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
