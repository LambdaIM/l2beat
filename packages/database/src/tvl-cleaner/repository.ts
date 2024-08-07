import { PostgresDatabase, Transaction } from '../kysely'
import { TvlCleanerRecord, toRecord, toRow } from './entity'
import { selectTvlCleaner } from './select'

export class TvlCleanerRepository {
  constructor(private readonly db: PostgresDatabase) {}

  async addOrUpdate(record: TvlCleanerRecord, trx?: Transaction) {
    const scope = trx ?? this.db

    const row = toRow(record)
    await scope
      .insertInto('public.tvl_cleaner')
      .values(row)
      .onConflict((cb) =>
        cb.column('repository_name').doUpdateSet({
          hourly_cleaned_until: row.hourly_cleaned_until,
          six_hourly_cleaned_until: row.six_hourly_cleaned_until,
        }),
      )
      .execute()

    return record.repositoryName
  }

  async find(repositoryName: string) {
    const row = await this.db
      .selectFrom('public.tvl_cleaner')
      .select(selectTvlCleaner)
      .where('repository_name', '=', repositoryName)
      .executeTakeFirst()

    return row ? toRecord(row) : undefined
  }

  deleteAll() {
    return this.db.deleteFrom('public.tvl_cleaner').execute()
  }
}
