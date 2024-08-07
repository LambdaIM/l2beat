import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { PostgresDatabase, Transaction } from '../kysely'
import { AggregatedL2CostRecord, toRecord, toRow } from './entity'
import { selectAggregatedL2Costs } from './select'

export class AggregatedL2CostRepository {
  constructor(private readonly db: PostgresDatabase) {}

  async getAll(): Promise<AggregatedL2CostRecord[]> {
    const rows = await this.db
      .selectFrom('public.aggregated_l2_costs')
      .select(selectAggregatedL2Costs)
      .execute()

    return rows.map(toRecord)
  }

  async addMany(
    records: AggregatedL2CostRecord[],
    trx?: Transaction,
  ): Promise<number> {
    const scope = trx ?? this.db
    const rows = records.map(toRow)

    await scope.insertInto('public.aggregated_l2_costs').values(rows).execute()

    return rows.length
  }

  async deleteAfter(from: UnixTime): Promise<void> {
    await this.db
      .deleteFrom('public.aggregated_l2_costs')
      .where('timestamp', '>', from.toDate())
      .execute()
  }

  async deleteAll(): Promise<void> {
    await this.db.deleteFrom('public.aggregated_l2_costs').execute()
  }

  async getByProjectAndTimeRange(
    projectId: ProjectId,
    timeRange: [UnixTime, UnixTime],
  ): Promise<AggregatedL2CostRecord[]> {
    const [from, to] = timeRange
    const rows = await this.db
      .selectFrom('public.aggregated_l2_costs')
      .select(selectAggregatedL2Costs)
      .where((eb) =>
        eb.and([
          eb('project_id', '=', projectId.toString()),
          eb('timestamp', '>=', from.toDate()),
          eb('timestamp', '<', to.toDate()),
        ]),
      )
      .orderBy('timestamp', 'asc')
      .execute()

    return rows.map(toRecord)
  }
}
