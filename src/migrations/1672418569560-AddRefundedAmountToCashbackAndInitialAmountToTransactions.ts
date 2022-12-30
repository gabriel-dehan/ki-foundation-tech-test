import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRefundedAmountToCashbackAndInitialAmountToTransactions1672418569560
  implements MigrationInterface
{
  name =
    'AddRefundedAmountToCashbackAndInitialAmountToTransactions1672418569560';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "initialAmount" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "cashback" ADD "refundedAmount" integer NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cashback" DROP COLUMN "refundedAmount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "initialAmount"`,
    );
  }
}
