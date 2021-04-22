import { MigrationInterface, QueryRunner } from 'typeorm';

export class contentsTable1618998373272 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "contents" ADD COLUMN "groupId" uuid`);
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "contents" DROP COLUMN "groupId" `);
  }
}
