import { Logger } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { describeDatabase } from '../../test/database'
import { IndexerStateRepository } from './IndexerStateRepository'

describeDatabase(IndexerStateRepository.name, (knex, kysely) => {
  const oldRepo = new IndexerStateRepository(knex, Logger.SILENT)
  const newRepo = kysely.indexerState

  suite(oldRepo)
  suite(newRepo)

  function suite(repository: typeof oldRepo | typeof newRepo) {
    afterEach(async () => {
      await repository.deleteAll()
    })

    describe(IndexerStateRepository.prototype.findIndexerState.name, () => {
      it('returns undefined if no record exists', async () => {
        const indexerState = await repository.findIndexerState('indexer')
        expect(indexerState).toEqual(undefined)
      })

      it('returns the indexer state if a record exists', async () => {
        const newRecord = {
          indexerId: 'indexer1',
          safeHeight: 12345,
          minTimestamp: UnixTime.now(),
          configHash: '0x123456',
        }
        await repository.addOrUpdate(newRecord)
        const indexerState = await repository.findIndexerState('indexer1')
        expect(indexerState).toEqual(newRecord)
      })
    })

    describe(IndexerStateRepository.prototype.getByIndexerIds.name, () => {
      it('returns indexer matching like statement', async () => {
        const record = {
          indexerId: 'a',
          safeHeight: 12345,
          minTimestamp: UnixTime.now(),
          configHash: '0x123456',
        }
        await repository.addOrUpdate(record)
        const record2 = {
          indexerId: 'b',
          safeHeight: 12345,
          minTimestamp: UnixTime.now(),
          configHash: '0x123456',
        }
        await repository.addOrUpdate(record2)
        const record3 = {
          indexerId: 'c',
          safeHeight: 12345,
          minTimestamp: UnixTime.now(),
          configHash: '0x123456',
        }
        await repository.addOrUpdate(record3)

        const indexerState = await repository.getByIndexerIds(['a', 'b'])
        expect(indexerState).toEqual([record, record2])
      })
    })

    describe(IndexerStateRepository.prototype.addOrUpdate.name, () => {
      it('adds a new record', async () => {
        const empty = await repository.getAll()
        expect(empty).toEqual([])

        const newRecord = {
          indexerId: 'indexer1',
          safeHeight: 1,
          minTimestamp: UnixTime.now(),
          configHash: '0x123456',
        }

        await repository.addOrUpdate(newRecord)

        const result = await repository.getAll()
        expect(result).toEqual([newRecord])
      })

      it('minTimestamp is undefined', async () => {
        const record = {
          indexerId: 'indexer1',
          safeHeight: 1,
          configHash: '0x123456',
        }
        await repository.addOrUpdate(record)

        const result = await repository.getAll()

        expect(result).toEqual([{ ...record, minTimestamp: undefined }])
      })

      it('configHash is undefined', async () => {
        const record = {
          indexerId: 'indexer1',
          safeHeight: 1,
          minTimestamp: UnixTime.ZERO,
        }
        await repository.addOrUpdate(record)

        const result = await repository.getAll()

        expect(result).toEqual([{ ...record, configHash: undefined }])
      })
    })

    describe(IndexerStateRepository.prototype.setSafeHeight.name, () => {
      it('updates the safe height of given indexer', async () => {
        const BEFORE = 12345
        const AFTER = 54321
        const record = {
          indexerId: 'indexer1',
          safeHeight: BEFORE,
          minTimestamp: UnixTime.now(),
          configHash: '0x123456',
        }
        await repository.addOrUpdate(record)

        const updated = await repository.setSafeHeight('indexer1', AFTER)
        const indexerState = await repository.findIndexerState('indexer1')

        expect(updated).toEqual(1)
        expect(indexerState).toEqual({ ...record, safeHeight: AFTER })
      })

      it('does not update if indexer not found', async () => {
        const BEFORE = 12345
        const AFTER = 54321
        const record = {
          indexerId: 'indexer1',
          safeHeight: BEFORE,
          minTimestamp: UnixTime.now(),
          configHash: '0x123456',
        }
        await repository.addOrUpdate(record)

        const updated = await repository.setSafeHeight('indexer2', AFTER)
        const indexerState = await repository.findIndexerState('indexer1')

        expect(updated).toEqual(0)
        expect(indexerState).toEqual({ ...record })
      })
    })
  }
})
