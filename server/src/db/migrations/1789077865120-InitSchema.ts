import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1789077865120 implements MigrationInterface {
  name = "InitSchema1789077865120";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "slug" character varying(100) NOT NULL, "description" text, "icon" character varying, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878" UNIQUE ("name"), CONSTRAINT "UQ_420d9f679d41281f282f5bc7d09" UNIQUE ("slug"), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "events" ADD "categoryId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "events" ADD CONSTRAINT "FK_2f7107d3528147b9237b6e2a2fe" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "events" DROP CONSTRAINT "FK_2f7107d3528147b9237b6e2a2fe"`,
    );
    await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "categoryId"`);
    await queryRunner.query(`DROP TABLE "categories"`);
  }
}
