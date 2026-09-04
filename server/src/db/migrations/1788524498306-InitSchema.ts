import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1788524498306 implements MigrationInterface {
    name = 'InitSchema1788524498306'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "events" ADD "isDonationBased" boolean DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "events" ADD "donationInfo" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "donationInfo"`);
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "isDonationBased"`);
    }

}
