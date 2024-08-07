import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { PostgresDatabase, Transaction } from '../kysely'
import { BlockTransactionCountRecord, toRecord, toRow } from './entity'
import { selectBlockTransactionCount } from './select'

export class BlockTransactionCountRepository {
  constructor(private readonly db: PostgresDatabase) {}

  async addOrUpdateMany(
    records: BlockTransactionCountRecord[],
    trx?: Transaction,
  ): Promise<number> {
    for (const record of records) {
      await this.addOrUpdate(record, trx)
    }
    return records.length
  }

  async addOrUpdate(record: BlockTransactionCountRecord, trx?: Transaction) {
    const scope = trx ?? this.db
    await scope
      .insertInto('activity.block')
      .values(toRow(record))
      .onConflict((cb) =>
        cb.columns(['project_id', 'block_number']).doUpdateSet({
          unix_timestamp: record.timestamp.toDate(),
          count: record.count,
        }),
      )
      .execute()

    return `${record.projectId.toString()}-${record.blockNumber}`
  }

  deleteAll() {
    return this.db.deleteFrom('activity.block').execute()
  }

  async findLastTimestampByProjectId(projectId: ProjectId) {
    const row = await this.db
      .selectFrom('activity.block')
      .select('unix_timestamp')
      .where('project_id', '=', projectId.toString())
      .orderBy('block_number', 'desc')
      .executeTakeFirst()

    return row ? UnixTime.fromDate(row.unix_timestamp) : undefined
  }

  async getAll() {
    const rows = await this.db
      .selectFrom('activity.block')
      .select(selectBlockTransactionCount)
      .execute()

    return rows.map(toRecord)
  }
}
