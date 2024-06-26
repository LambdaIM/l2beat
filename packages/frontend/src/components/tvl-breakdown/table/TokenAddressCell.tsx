import { EthereumAddress } from '@l2beat/shared-pure'
import React from 'react'

import { formatAddress } from '../../../utils/utils'
import { OutLinkIcon } from '../../icons'

interface TokenAddressCellProps {
  address: EthereumAddress
  explorer?: string
}

export function TokenAddressCell(props: TokenAddressCellProps) {
  if (!props.explorer) {
    return (
      <span className="pr-2 font-medium text-xs">
        {formatAddress(props.address)}
      </span>
    )
  }

  return (
    <a
      href={`${props.explorer}/address/${props.address.toString()}`}
      target="_blank"
      className="flex gap-1 pr-2 font-medium text-blue-700 text-xs underline dark:text-blue-500"
    >
      {formatAddress(props.address)}
      <OutLinkIcon className="fill-blue-700 dark:fill-blue-500" />
    </a>
  )
}
