/*
  Warnings:

  - Added the required column `notes` to the `todo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."todo" ADD COLUMN     "notes" TEXT NOT NULL;
