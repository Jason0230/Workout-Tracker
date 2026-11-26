const { prisma } = require("../config/dbConnection");

const defaultExercises = [
  "Bench Press",
  "Incline Bench Press",
  "Overhead Press",
  "Squat",
  "Romanian Deadlift",
  "Deadlift",
  "Leg Press",
  "Pull-Up",
  "Barbell Row",
  "Lat Pulldown",
  "Bicep Curl",
  "Tricep Pushdown",
  "Lateral Raise",
  "Plank",
];

async function main() {
  for (const name of defaultExercises) {
    const existing = await prisma.exercise.findFirst({
      where: { name, userId: null },
    });

    if (!existing) {
      await prisma.exercise.create({
        data: { name, userId: null, category:"" },
      });
    }
  }

  console.log(`Seeded ${defaultExercises.length} default exercises.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });