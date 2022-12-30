import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRefundedAmountToTransactions1672416485460 implements MigrationInterface {
    name = 'AddRefundedAmountToTransactions1672416485460'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" ADD "refundedAmount" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "refundedAmount"`);
    }

}
