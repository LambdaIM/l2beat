import React from 'react'

import { cn } from '../../utils/cn'
import { SortingArrowDownIcon, SortingArrowUpIcon } from '../icons'
import { SortingRule, SortingState } from './types'

interface Props {
  children?: React.ReactNode
  name: string
  rule: SortingRule
  orderKey: string | undefined
  // Please keep in mind that defaultState does not affect the on load state of the table.
  // If you want to change default sorting do this in getProps file of given page.
  defaultState?: SortingState
}

export function SortingArrows(props: Props) {
  const name = props.name
    .split(' ')
    .join('-')
    .split('\n')
    .join('-')
    .toLowerCase()
  return (
    <div
      className="group/sorting-arrows flex cursor-pointer select-none items-end gap-1.5"
      data-role="sorting-arrows"
      data-name={name}
      data-rule={props.rule}
      data-state={props.defaultState}
      data-order-key={props.orderKey}
    >
      <div className="flex translate-y-[-4.5px] flex-col">
        <SortingArrowUpIcon
          className={cn(
            'mb-0.5 fill-gray-550 transition-all dark:fill-gray-650',
            'dark:group-data-[state=asc]/sorting-arrows:fill-white group-data-[state=asc]/sorting-arrows:fill-black',
            'dark:group-data-[state=desc]/sorting-arrows:group-hover/sorting-arrows:fill-white group-data-[state=desc]/sorting-arrows:group-hover/sorting-arrows:fill-black dark:group-data-[state=desc]/sorting-arrows:group-hover/sorting-arrows:opacity-60 group-data-[state=desc]/sorting-arrows:group-hover/sorting-arrows:opacity-70',
          )}
        />
        <SortingArrowDownIcon
          className={cn(
            'fill-gray-550 transition-all dark:fill-gray-650',
            'dark:group-data-[state=desc]/sorting-arrows:fill-white group-data-[state=desc]/sorting-arrows:fill-black',
            'dark:group-hover/sorting-arrows:fill-white group-hover/sorting-arrows:fill-black dark:group-data-[state=asc]/sorting-arrows:group-hover/sorting-arrows:opacity-60 group-data-[state=asc]/sorting-arrows:group-hover/sorting-arrows:opacity-70',
          )}
        />
      </div>
      {props.children}
    </div>
  )
}
