import { Logger } from '@l2beat/backend-tools'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { describeDatabase } from '../../../test/database'
import { StarkexTransactionCountRepository } from './StarkexCountRepository'

const PROJECT_A = ProjectId('project-a')
const PROJECT_B = ProjectId('project-b')

describeDatabase(StarkexTransactionCountRepository.name, (knex, kysely) => {
  const oldRepo = new StarkexTransactionCountRepository(knex, Logger.SILENT)
  const newRepo = kysely.starkExTransactionCount

  suite(oldRepo)
  suite(newRepo)

  function suite(repository: typeof oldRepo | typeof newRepo) {
    beforeEach(async () => {
      await repository.deleteAll()
    })

    describe(
      StarkexTransactionCountRepository.prototype.findLastTimestampByProjectId
        .name,
      () => {
        it('works with empty database', async () => {
          expect(
            await repository.findLastTimestampByProjectId(
              ProjectId('starknet'),
            ),
          ).toEqual(undefined)
        })
      },
    )

    describe(
      StarkexTransactionCountRepository.prototype.addOrUpdateMany.name,
      () => {
        it('adds multiple records', async () => {
          const records = [
            mockRecord(PROJECT_A, 0, 100),
            mockRecord(PROJECT_B, 0, 200),
          ]

          await repository.addOrUpdateMany(records)

          const result = await repository.getAll()

          expect(result).toEqual(records)
        })

        it('updates multiple records', async () => {
          const records = [
            mockRecord(PROJECT_A, 0, 100),
            mockRecord(PROJECT_B, 0, 200),
          ]
          await repository.addOrUpdateMany(records)

          const updatedRecords = [
            mockRecord(PROJECT_A, 0, 1000),
            mockRecord(PROJECT_B, 0, 2000),
          ]
          await repository.addOrUpdateMany(updatedRecords)

          const result = await repository.getAll()

          expect(result).toEqual(updatedRecords)
        })
      },
    )
  }
})

const mockRecord = (projectId: ProjectId, offset: number, count: number) => ({
  projectId,
  count,
  timestamp: new UnixTime(1000 + offset),
})
