import { MigrationInterface, QueryRunner } from 'typeorm';

export class contentsTable1618998373271 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`ALTER TABLE contents ADD groupId uuid`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.dropColumn('contents', 'groupId');
  }
}
