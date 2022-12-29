import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersCreateBankAccountsCreateTransactions1672341111285
  implements MigrationInterface
{
  name = 'CreateUsersCreateBankAccountsCreateTransactions1672341111285';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."user_role_enum" AS ENUM('ADMIN', 'USER')`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "role" "public"."user_role_enum" NOT NULL DEFAULT 'USER', CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e11e649824a45d8ed01d597fd9" ON "user" ("createdAt") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."transaction_type_enum" AS ENUM('CARD', 'TRANSFER', 'REFUND')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."transaction_status_enum" AS ENUM('PENDING', 'FULFILLED', 'FAILED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "transaction" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "description" text NOT NULL, "type" "public"."transaction_type_enum" NOT NULL, "amount" integer NOT NULL, "metadata" jsonb NOT NULL DEFAULT '{}', "status" "public"."transaction_status_enum" NOT NULL DEFAULT 'PENDING', "bankAccountId" uuid NOT NULL, CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_83cb622ce2d74c56db3e0c29f1" ON "transaction" ("createdAt") `,
    );
    await queryRunner.query(
      `CREATE TABLE "bank_account" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "IBAN" character varying, "BIC" character varying, "userId" uuid NOT NULL, CONSTRAINT "UQ_4dcf13d5f8f83bb421c468cd912" UNIQUE ("IBAN"), CONSTRAINT "UQ_53c6447961d47c4ee4b006b8ae8" UNIQUE ("BIC"), CONSTRAINT "PK_f3246deb6b79123482c6adb9745" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_858933c6dee814d948df70e352" ON "bank_account" ("createdAt") `,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_07540dda5970c29494e0f70f89e" FOREIGN KEY ("bankAccountId") REFERENCES "bank_account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bank_account" ADD CONSTRAINT "FK_c2ba1381682b0291238cbc7a65d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bank_account" DROP CONSTRAINT "FK_c2ba1381682b0291238cbc7a65d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_07540dda5970c29494e0f70f89e"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_858933c6dee814d948df70e352"`,
    );
    await queryRunner.query(`DROP TABLE "bank_account"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_83cb622ce2d74c56db3e0c29f1"`,
    );
    await queryRunner.query(`DROP TABLE "transaction"`);
    await queryRunner.query(`DROP TYPE "public"."transaction_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."transaction_type_enum"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e11e649824a45d8ed01d597fd9"`,
    );
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
  }
}
