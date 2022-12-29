import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateBrandsCreateMerchantsCreateCashbacks1672341187754
  implements MigrationInterface
{
  name = 'CreateBrandsCreateMerchantsCreateCashbacks1672341187754';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."cashback_status_enum" AS ENUM('PENDING', 'FULFILLED', 'FAILED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "cashback" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "status" "public"."cashback_status_enum" NOT NULL DEFAULT 'PENDING', "transactionId" uuid NOT NULL, "merchantId" uuid NOT NULL, CONSTRAINT "PK_367dfa7e4e15d45766d2260e3e0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_104881aa81653efde901f013d8" ON "cashback" ("createdAt") `,
    );
    await queryRunner.query(
      `CREATE TABLE "merchant" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "isPhysical" boolean NOT NULL, "address" text, "url" text, "brandId" uuid NOT NULL, CONSTRAINT "PK_9a3850e0537d869734fc9bff5d6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_89f3c3e8680f7fefadde52d2c0" ON "merchant" ("createdAt") `,
    );
    await queryRunner.query(
      `CREATE TABLE "brand" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "logoUrl" text NOT NULL, "description" text, "cashbackAmountPercentage" numeric NOT NULL, CONSTRAINT "PK_a5d20765ddd942eb5de4eee2d7f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_da2fb4d360949412a0b27322f5" ON "brand" ("createdAt") `,
    );
    await queryRunner.query(
      `ALTER TABLE "cashback" ADD CONSTRAINT "FK_beab9a578d2396a0ae89347fd41" FOREIGN KEY ("transactionId") REFERENCES "transaction"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cashback" ADD CONSTRAINT "FK_b9ade45892f02f3f934231110bd" FOREIGN KEY ("merchantId") REFERENCES "merchant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "merchant" ADD CONSTRAINT "FK_f452746aa75748ac09c7b3385c6" FOREIGN KEY ("brandId") REFERENCES "brand"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "merchant" DROP CONSTRAINT "FK_f452746aa75748ac09c7b3385c6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cashback" DROP CONSTRAINT "FK_b9ade45892f02f3f934231110bd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cashback" DROP CONSTRAINT "FK_beab9a578d2396a0ae89347fd41"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_da2fb4d360949412a0b27322f5"`,
    );
    await queryRunner.query(`DROP TABLE "brand"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_89f3c3e8680f7fefadde52d2c0"`,
    );
    await queryRunner.query(`DROP TABLE "merchant"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_104881aa81653efde901f013d8"`,
    );
    await queryRunner.query(`DROP TABLE "cashback"`);
    await queryRunner.query(`DROP TYPE "public"."cashback_status_enum"`);
  }
}
