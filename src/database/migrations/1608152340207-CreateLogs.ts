import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateLogs1608152340207 implements MigrationInterface {
  private table = new Table({
    name: 'logs',
    columns: [
      {
        name: 'id',
        type: 'int',
        isGenerated: true,
        isPrimary: true,
        generationStrategy: 'increment',
      },
      {
        name: 'type',
        type: 'varchar',
        isNullable: false,
      },
      {
        name: 'description',
        type: 'varchar',
        isNullable: false,
      },
      {
        name: 'created_at',
        type: 'timestamptz',
        isNullable: false,
        default: 'now()',
      },
      {
        name: 'updated_at',
        type: 'timestamptz',
        isNullable: false,
        default: 'now()',
      },
    ],
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(this.table);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.table);
  }
}
