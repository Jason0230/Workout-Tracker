const {PrismaClient} = require("../generated");
const prisma = new PrismaClient({log: [
    { emit: 'stdout', level: 'query' }, // Logs the actual SQL/MongoDB query
    { emit: 'stdout', level: 'info' },
    { emit: 'stdout', level: 'warn' },
    { emit: 'stdout', level: 'error' }, // Logs query execution errors
  ],});

const connectDb = async () => {
  try {
    await prisma.$connect();
    console.log("Database connected");
  } catch (err) {
    console.error("Database connection failed:", err);
    process.exit(1);
  }
};

module.exports = connectDb;
module.exports.prisma = prisma;