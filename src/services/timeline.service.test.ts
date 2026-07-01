import { timelineRepository } from '@/repositories/timeline.repository'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { timelineService } from './timeline.service'

vi.mock('@/repositories/timeline.repository', () => ({
  timelineRepository: {
    findRunningTimelog: vi.fn(),
    findDayTimelogs: vi.fn(),
  },
}))

describe('timelineService.findRunningTimelog', () => {
  beforeEach(() => vi.clearAllMocks()) // テスト間で偽物の設定をリセット

  it('稼働中のログがなければnullを返す', async () => {
    vi.mocked(timelineRepository.findRunningTimelog).mockResolvedValue(null)
    const result = await timelineService.findRunningTimelog('user-1')
    expect(result).toBeNull()
  })

  it('稼働中のログがあればDTOに変換して返す', async () => {
    // 1. 材料(偽ログ)を用意
    const fakeLog: NonNullable<
      Awaited<ReturnType<typeof timelineRepository.findRunningTimelog>>
    > = {
      id: 'log-1',
      activityId: 'act-1',
      startAt: new Date('2026-06-30T01:00:00.000Z'),
      endAt: null,
      memo: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      activity: {
        id: 'act-1',
        profileId: 'profile-1',
        name: '勉強',
        colorToken: 'blue',
        sortOrder: null,
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }

    // 2. 偽ログを返すよう設定
    vi.mocked(timelineRepository.findRunningTimelog).mockResolvedValue(fakeLog)

    // 3. サービスを実行
    const result = await timelineService.findRunningTimelog('user-1')

    // 4. 変換後の形を検証
    expect(result).toEqual({
      running: true,
      log: {
        id: 'log-1',
        activityId: 'act-1',
        activityName: '勉強',
        colorToken: 'blue',
        startAt: '2026-06-30T01:00:00.000Z',
      },
    })
  })

  it('指定した期間のログをDTOの配列に変換して返す', async () => {
    // 1. 材料(偽ログ=Prismaの生データ)を用意
    const fakeLog: Awaited<
      ReturnType<typeof timelineRepository.findDayTimelogs>
    > = [
      {
        id: 'log-1',
        activityId: 'act-1',
        startAt: new Date('2026-06-30T01:00:00.000Z'),
        endAt: new Date('2026-07-01T01:00:00.000Z'),
        memo: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        activity: { id: 'act-1', name: '勉強', colorToken: 'blue' },
      },
    ]

    // 2. 偽ログの配列を返すよう設定
    vi.mocked(timelineRepository.findDayTimelogs).mockResolvedValue(fakeLog)

    // 3. サービスを実行
    const result = await timelineService.findDayTimelogs(
      'user-1',
      new Date(),
      new Date(),
    )

    // 4. 変換後の形を検証
    expect(result).toEqual([
      {
        id: 'log-1',
        title: '勉強',
        startAt: '2026-06-30T01:00:00.000Z',
        endAt: '2026-07-01T01:00:00.000Z',
        category: { colorToken: 'blue' },
      },
    ])
  })
})
