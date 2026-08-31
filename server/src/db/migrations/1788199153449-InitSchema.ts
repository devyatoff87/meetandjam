import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1788199153449 implements MigrationInterface {
  name = "InitSchema1788199153449";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "event_participants" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "eventId" uuid NOT NULL, "userId" uuid NOT NULL, "joinedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_b65ffd558d76fd51baffe81d42b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_EVENT-PARTICIPANT_EVENT-USER" ON "event_participants" ("eventId", "userId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "tags" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "color" character varying(100), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_d90243459a697eadb8ad56e9092" UNIQUE ("name"), CONSTRAINT "PK_e7dc17249a1148a1970748eda99" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "events" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(255) NOT NULL, "description" text NOT NULL, "capacity" integer NOT NULL, "entryPrice" integer NOT NULL, "address" character varying(255) NOT NULL, "startedAt" TIMESTAMP WITH TIME ZONE NOT NULL, "ownerId" uuid NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_40731c7151fe4be3116e45ddf73" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(255) NOT NULL, "passwordHash" character varying(255) NOT NULL, "name" character varying(255) NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "event_tags" ("eventId" uuid NOT NULL, "tagId" uuid NOT NULL, CONSTRAINT "PK_30b839648a80f9cc7a2ee4a57e9" PRIMARY KEY ("eventId", "tagId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1a22f44008ad89e6b8ccf71af1" ON "event_tags" ("eventId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_802db9517c84ab20eb93dfd8a1" ON "event_tags" ("tagId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "event_participants" ADD CONSTRAINT "FK_4907f15416577c3bbbcd604d121" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_participants" ADD CONSTRAINT "FK_d1b1a40ec360951071605b0f7a0" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "events" ADD CONSTRAINT "FK_72bbe49600962f125177d7d6b68" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_tags" ADD CONSTRAINT "FK_1a22f44008ad89e6b8ccf71af18" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_tags" ADD CONSTRAINT "FK_802db9517c84ab20eb93dfd8a14" FOREIGN KEY ("tagId") REFERENCES "tags"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "event_tags" DROP CONSTRAINT "FK_802db9517c84ab20eb93dfd8a14"`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_tags" DROP CONSTRAINT "FK_1a22f44008ad89e6b8ccf71af18"`,
    );
    await queryRunner.query(
      `ALTER TABLE "events" DROP CONSTRAINT "FK_72bbe49600962f125177d7d6b68"`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_participants" DROP CONSTRAINT "FK_d1b1a40ec360951071605b0f7a0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_participants" DROP CONSTRAINT "FK_4907f15416577c3bbbcd604d121"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_802db9517c84ab20eb93dfd8a1"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1a22f44008ad89e6b8ccf71af1"`,
    );
    await queryRunner.query(`DROP TABLE "event_tags"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "events"`);
    await queryRunner.query(`DROP TABLE "tags"`);
    await queryRunner.query(
      `DROP INDEX "public"."UQ_EVENT-PARTICIPANT_EVENT-USER"`,
    );
    await queryRunner.query(`DROP TABLE "event_participants"`);
  }
}
