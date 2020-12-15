import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateCustomers1606131922139 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    await queryRunner.query(`CREATE TABLE "customers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" varchar NOT NULL, "password" varchar NOT NULL, "hotmart_email" varchar NOT NULL, "pagex_email" varchar, "pagex_id" varchar, "active" boolean NOT NULL, "reset_token" varchar DEFAULT '', "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), CONSTRAINT "UQ_9f618ae933e77c4b06095d7737a" UNIQUE ("hotmart_email"), CONSTRAINT "PK_133ec679a801fab5e070f73d3ea" PRIMARY KEY ("id"))`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "customers"`);
  }
}
