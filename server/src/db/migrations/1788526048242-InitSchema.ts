import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1788526048242 implements MigrationInterface {
    name = 'InitSchema1788526048242'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "role" character varying NOT NULL DEFAULT 'user'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "role"`);
    }

}
