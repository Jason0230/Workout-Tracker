/*
  Warnings:

  - You are about to drop the column `exerciseId` on the `Set` table. All the data in the column will be lost.
  - You are about to drop the column `workoutId` on the `Set` table. All the data in the column will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `workoutExerciseId` to the `Set` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Set` DROP FOREIGN KEY `Set_exerciseId_fkey`;

-- DropForeignKey
ALTER TABLE `Set` DROP FOREIGN KEY `Set_workoutId_fkey`;

-- added
ALTER TABLE `Workout` DROP FOREIGN KEY `Workout_userId_fkey`;

-- DropIndex
DROP INDEX `Set_exerciseId_fkey` ON `Set`;

-- DropIndex
DROP INDEX `Set_workoutId_fkey` ON `Set`;

-- DropIndex
DROP INDEX `Workout_userId_fkey` ON `Workout`;

-- AlterTable
ALTER TABLE `Set` DROP COLUMN `exerciseId`,
    DROP COLUMN `workoutId`,
    ADD COLUMN `workoutExerciseId` INTEGER NOT NULL;

-- DropTable
DROP TABLE `user`;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `refreshToken` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WorkoutExercise` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `workoutId` INTEGER NOT NULL,
    `exerciseId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Workout` ADD CONSTRAINT `Workout_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WorkoutExercise` ADD CONSTRAINT `WorkoutExercise_workoutId_fkey` FOREIGN KEY (`workoutId`) REFERENCES `Workout`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WorkoutExercise` ADD CONSTRAINT `WorkoutExercise_exerciseId_fkey` FOREIGN KEY (`exerciseId`) REFERENCES `Exercise`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Set` ADD CONSTRAINT `Set_workoutExerciseId_fkey` FOREIGN KEY (`workoutExerciseId`) REFERENCES `WorkoutExercise`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
