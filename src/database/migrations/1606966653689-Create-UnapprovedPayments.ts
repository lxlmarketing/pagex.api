import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateUnapprovedPayments1606966653689
  implements MigrationInterface {
  private table = new Table({
    name: 'unapproved_payments',
    columns: [
      {
        name: 'id',
        type: 'int',
        isGenerated: true,
        isPrimary: true,
        generationStrategy: 'increment',
      },
      {
        name: 'customer_id',
        type: 'uuid',
        isNullable: false
      },
      {
        name: 'pagex_id',
        type: 'varchar',
        isNullable: false
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

  private foreignKey = new TableForeignKey({
    columnNames: ['customer_id'],
    referencedColumnNames: ['id'],
    referencedTableName: 'customers',
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(this.table);
    await queryRunner.createForeignKey('unapproved_payments', this.foreignKey)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.table);
  }
}
