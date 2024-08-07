import { BadgeId, WarningWithSentiment } from '@l2beat/config'
import React from 'react'
import { HorizontalSeparator } from '../../../../components/HorizontalSeparator'
import { WarningBar } from '../../../../components/WarningBar'
import { DesktopProjectLinks } from '../../../../components/header/DesktopProjectLinks'
import { MobileProjectLinks } from '../../../../components/header/MobileProjectLinks'
import {
  ProjectSummary,
  ProjectSummaryStat,
} from '../../../../components/header/ProjectSummary'
import { TvlStats, TvlSummary } from '../../../../components/header/TvlSummary'
import { BigRosette } from '../../../../components/rosette'
import { cn } from '../../../../utils/cn'
import { RiskValues } from '../../../../utils/risks/types'
import { getUnderReviewText } from '../../common/getUnderReviewText'
import { ProjectLink } from '../../types'
import { ArchivedBar } from './ArchivedBar'
import { ProjectAboutSection } from './ProjectAboutSection'
import { ProjectHeader } from './ProjectHeader'
import { UnderReviewBar } from './UnderReviewBar'
import { UpcomingBar } from './UpcomingBar'

export interface HeaderProps {
  title: string
  description: string | undefined
  icon?: string
  stats: FullSummaryStats
  tvlBreakdownHref?: string
  tvlWarning?: WarningWithSentiment
  showTvlBreakdown?: boolean
  risks?: RiskValues
  links: ProjectLink[]
  type: 'bridge' | 'layer2' | 'layer3'
  warning?: string | { text: string; href: string }
  isArchived?: boolean
  isUpcoming?: boolean
  isRiskRosetteUnderReview?: boolean
  isUnderReview?: boolean
  isImplementationUnderReview?: boolean
  badges?: BadgeId[]
}

export interface FullSummaryStats {
  summary: ProjectSummaryStat[]
  l2Tvl?: TvlStats
}

export function DetailsHeader(props: HeaderProps) {
  const areAllRisksUpcoming = props.risks
    ? Object.values(props.risks).every((value) => {
        return (
          value.value === '' &&
          value.description === 'No information available.'
        )
      })
    : undefined
  const isL2orL3 = props.type === 'layer2' || props.type === 'layer3'

  return (
    <>
      <header className="flex flex-row justify-end gap-3 bg-gray-100 pt-6 md:gap-0 dark:bg-zinc-900 md:bg-transparent md:dark:bg-transparent">
        <div className="flex w-full flex-wrap divide-y divide-gray-200 md:gap-4 md:divide-y-0 dark:divide-gray-850">
          <div className="mb-4 flex w-full flex-col gap-2 px-4 md:mb-0 md:px-0">
            <ProjectHeader title={props.title} icon={props.icon} />
            {props.isArchived && <ArchivedBar />}
            {props.isUpcoming && <UpcomingBar />}
            {(props.isUnderReview || props.isImplementationUnderReview) && (
              <UnderReviewBar
                text={getUnderReviewText(
                  props.isUnderReview,
                  props.isImplementationUnderReview,
                )}
              />
            )}
            {props.warning && (
              <WarningBar
                text={
                  typeof props.warning === 'string'
                    ? props.warning
                    : props.warning.text
                }
                href={
                  typeof props.warning !== 'string'
                    ? props.warning.href
                    : undefined
                }
                color="yellow"
                isCritical={false}
                className="w-full items-center justify-center p-2.5 text-xs md:text-base"
              />
            )}
            <ProjectAboutSection
              type="mobile"
              className="md:hidden"
              description={props.description}
              badges={props.badges}
            />
          </div>
          <div className="my-2 hidden w-full md:block">
            <DesktopProjectLinks projectLinks={props.links} />
          </div>
          <div
            className={cn(
              'grid w-full divide-y divide-gray-200 md:gap-4 md:divide-y-0 dark:divide-gray-850',
              isL2orL3 && 'md:grid-cols-3',
            )}
          >
            {isL2orL3 && (
              <TvlSummary
                stats={props.stats.l2Tvl}
                tvlBreakdownHref={props.tvlBreakdownHref}
                tvlWarning={props.tvlWarning}
                showTvlBreakdown={props.showTvlBreakdown}
                isArchived={props.isArchived}
                type={props.type}
              />
            )}
            <ProjectSummary
              stats={props.stats.summary}
              type={props.type}
              className="md:col-span-2"
            />
          </div>
          <div className="w-full px-4 md:hidden md:px-0">
            <MobileProjectLinks projectLinks={props.links} />
          </div>
        </div>
        {props.risks && (
          <div className="mt-auto ml-8 hidden lg:block">
            <BigRosette
              risks={props.risks}
              isUpcoming={props.isUpcoming ?? areAllRisksUpcoming}
              isUnderReview={props.isRiskRosetteUnderReview}
            />
          </div>
        )}
      </header>
      <div className="hidden md:block">
        <HorizontalSeparator className="hidden md:mt-6 md:block" />
        <ProjectAboutSection
          type="desktop"
          description={props.description}
          badges={props.badges}
        />
      </div>
      <HorizontalSeparator className="hidden md:mt-6 md:block" />
    </>
  )
}
