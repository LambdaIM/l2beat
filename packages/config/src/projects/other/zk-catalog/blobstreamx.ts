import { ChainId, EthereumAddress } from '@l2beat/shared-pure'
import { ZkCatalogProject } from './types'

export const blobstreamx: ZkCatalogProject = {
  display: {
    slug: 'blobstreamx',
    name: 'BlobstreamX',
  },
  proofVerification: {
    aggregation: false,
    verifiers: [
      {
        name: 'HeaderRangeVerifier (Ethereum)',
        description:
          'Celestia ZK light client verifying multiple blocks at once. Deployed on Ethereum mainnet.',
        contractAddress: EthereumAddress(
          '0xF33a22dFf8017813b95E5a05c9a97BaFE693001E',
        ),
        chainId: ChainId.ETHEREUM,
        verified: 'no',
        subVerifiers: [
          {
            name: 'Final wrap',
            proofSystem: 'Plonk SNARK',
            mainArithmetization: 'Plonk',
            mainPCS: 'KZG',
            trustedSetup: '?',
          },
          {
            name: 'Main circuit',
            proofSystem: 'Plonky2',
            mainArithmetization: 'Plonk',
            mainPCS: 'FRI',
            trustedSetup: 'None',
            link: 'https://github.com/succinctlabs/blobstreamx/blob/main/circuits/header_range.rs',
          },
        ],
      },
      {
        name: 'NextHeaderVerifier (Ethereum)',
        description:
          'Celestia ZK light client verifying a single block. Deployed on Ethereum mainnet.',
        contractAddress: EthereumAddress(
          '0x037E57EF3a130CD23988a4Ed530d79d6f97a0f06',
        ),
        chainId: ChainId.ETHEREUM,
        verified: 'no',
        subVerifiers: [
          {
            name: 'Final wrap',
            proofSystem: 'Plonk SNARK',
            mainArithmetization: 'Plonk',
            mainPCS: 'KZG',
            trustedSetup: '?',
          },
          {
            name: 'Main circuit',
            proofSystem: 'Plonky2',
            mainArithmetization: 'Plonk',
            mainPCS: 'FRI',
            trustedSetup: 'None',
            link: 'https://github.com/succinctlabs/blobstreamx/blob/main/circuits/next_header.rs',
          },
        ],
      },
      {
        name: 'HeaderRangeVerifier (Base)',
        description:
          'Celestia ZK light client verifying multiple blocks at once. Deployed on Base.',
        contractAddress: EthereumAddress(
          '0xF2415C44F47983F7dD22003B46A034B1F1d04e44',
        ),
        chainId: ChainId.BASE,
        verified: 'no',
        subVerifiers: [
          {
            name: 'Final wrap',
            proofSystem: 'Plonk SNARK',
            mainArithmetization: 'Plonk',
            mainPCS: 'KZG',
            trustedSetup: '?',
          },
          {
            name: 'Main circuit',
            proofSystem: 'Plonky2',
            mainArithmetization: 'Plonk',
            mainPCS: 'FRI',
            trustedSetup: 'None',
            link: 'https://github.com/succinctlabs/blobstreamx/blob/main/circuits/header_range.rs',
          },
        ],
      },
      {
        name: 'NextHeaderVerifier (Base)',
        description:
          'Celestia ZK light client verifying a single block. Deployed on Base.',
        contractAddress: EthereumAddress(
          '0xe859F565f4AdF7AAc3a94a6C6d89093d754Ec4f6',
        ),
        chainId: ChainId.BASE,
        verified: 'no',
        subVerifiers: [
          {
            name: 'Final wrap',
            proofSystem: 'Plonk SNARK',
            mainArithmetization: 'Plonk',
            mainPCS: 'KZG',
            trustedSetup: '?',
          },
          {
            name: 'Main circuit',
            proofSystem: 'Plonky2',
            mainArithmetization: 'Plonk',
            mainPCS: 'FRI',
            trustedSetup: 'None',
            link: 'https://github.com/succinctlabs/blobstreamx/blob/main/circuits/next_header.rs',
          },
        ],
      },
      {
        name: 'HeaderRangeVerifier (Arbitrum One)',
        description:
          'Celestia ZK light client verifying multiple blocks at once. Deployed on Arbitrum One.',
        contractAddress: EthereumAddress(
          '0x4d0C32ddA9De7CD89e198cFe5E01470A49b8acD3',
        ),
        chainId: ChainId.ARBITRUM,
        verified: 'no',
        subVerifiers: [
          {
            name: 'Final wrap',
            proofSystem: 'Plonk SNARK',
            mainArithmetization: 'Plonk',
            mainPCS: 'KZG',
            trustedSetup: '?',
          },
          {
            name: 'Main circuit',
            proofSystem: 'Plonky2',
            mainArithmetization: 'Plonk',
            mainPCS: 'FRI',
            trustedSetup: 'None',
            link: 'https://github.com/succinctlabs/blobstreamx/blob/main/circuits/header_range.rs',
          },
        ],
      },
      {
        name: 'NextHeaderVerifier (Arbitrum One)',
        description:
          'Celestia ZK light client verifying a single block. Deployed on Arbitrum One.',
        contractAddress: EthereumAddress(
          '0xfEA1EFaE3cDe8C524168726a7fc46BF2134bb72C',
        ),
        chainId: ChainId.ARBITRUM,
        verified: 'no',
        subVerifiers: [
          {
            name: 'Final wrap',
            proofSystem: 'Plonk SNARK',
            mainArithmetization: 'Plonk',
            mainPCS: 'KZG',
            trustedSetup: '?',
          },
          {
            name: 'Main circuit',
            proofSystem: 'Plonky2',
            mainArithmetization: 'Plonk',
            mainPCS: 'FRI',
            trustedSetup: 'None',
            link: 'https://github.com/succinctlabs/blobstreamx/blob/main/circuits/next_header.rs',
          },
        ],
      },
    ],
    requiredTools: [],
  },
  type: 'zk-catalog',
}
