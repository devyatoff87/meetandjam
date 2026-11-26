import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNoteToEventParticipant1795734212991 implements MigrationInterface {
  name = "AddNoteToEventParticipant1795734212991";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "event_participants" ADD "note" character varying(64)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "event_participants" DROP COLUMN "note"`,
    );
  }
}
