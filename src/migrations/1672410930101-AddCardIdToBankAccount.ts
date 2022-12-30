import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCardIdToBankAccount1672410930101 implements MigrationInterface {
  name = 'AddCardIdToBankAccount1672410930101';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bank_account" ADD "cardId" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "bank_account" ADD CONSTRAINT "UQ_9f9a5776b2b8959d6b32cca7717" UNIQUE ("cardId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bank_account" DROP CONSTRAINT "UQ_9f9a5776b2b8959d6b32cca7717"`,
    );
    await queryRunner.query(`ALTER TABLE "bank_account" DROP COLUMN "cardId"`);
  }
}
