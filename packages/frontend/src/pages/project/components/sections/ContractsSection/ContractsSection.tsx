import {
  ManuallyVerifiedContracts,
  VerificationStatus,
} from '@l2beat/shared-pure'
import partition from 'lodash/partition'
import React from 'react'

import { ContractEntry, TechnologyContract } from '../common/ContractEntry'
import { ProjectSection } from '../common/ProjectSection'
import { ReferenceList, TechnologyReference } from '../common/ReferenceList'
import { RiskList, TechnologyRisk } from '../common/RiskList'
import { TechnologyIncompleteShort } from '../common/TechnologyIncomplete'
import { ProjectSectionId } from '../common/sectionId'
import { ContractsUpdated } from './ContractsUpdated'

export interface ContractsSectionProps {
  id: ProjectSectionId
  chainName: string
  title: string
  sectionOrder: number
  contracts: TechnologyContract[]
  nativeContracts: Record<string, TechnologyContract[]>
  escrows: TechnologyContract[]
  risks: TechnologyRisk[]
  references: TechnologyReference[]
  architectureImage?: string
  isIncomplete?: boolean
  isUnderReview?: boolean
  verificationStatus: VerificationStatus
  manuallyVerifiedContracts: ManuallyVerifiedContracts
}

export function ContractsSection(props: ContractsSectionProps) {
  if (
    props.contracts.length === 0 &&
    Object.keys(props.nativeContracts).length === 0 &&
    props.escrows.length === 0 &&
    props.risks.length === 0 &&
    !props.isUnderReview
  ) {
    return null
  }

  const [changedContracts, unchangedContracts] = partition(
    props.contracts,
    (c) => c.implementationHasChanged,
  )

  const paritionedNativeContracts = Object.fromEntries(
    Object.entries(props.nativeContracts).map(([chainName, contracts]) => {
      return [
        chainName,
        partition(contracts, (c) => c.implementationHasChanged),
      ]
    }),
  )

  const [changedEscrows, unchangedEscrows] = partition(
    props.escrows,
    (c) => c.implementationHasChanged,
  )
  const hasContractsImplementationChanged = props.contracts.some(
    (c) => c.implementationHasChanged,
  )

  return (
    <ProjectSection
      title={props.title}
      id={props.id}
      sectionOrder={props.sectionOrder}
      isUnderReview={props.isUnderReview}
      includeChildrenIfUnderReview
    >
      {hasContractsImplementationChanged && <ContractsUpdated />}
      {props.isIncomplete && <TechnologyIncompleteShort />}
      {props.architectureImage && (
        <figure className="mt-4 mb-8 text-center">
          <img
            className="inline max-w-full align-[unset] dark:invert"
            src={props.architectureImage}
            alt="A diagram of the smart contract architecture"
          />
          <figcaption className="text-gray-500 text-xs dark:text-gray-600">
            A diagram of the smart contract architecture
          </figcaption>
        </figure>
      )}
      {props.contracts.length > 0 && (
        <>
          <h3 className="font-bold">
            The system consists of the following smart contracts on the host
            chain ({props.chainName}):
          </h3>
          <div className="my-4">
            {unchangedContracts.map((contract, i) => (
              <React.Fragment key={i}>
                <ContractEntry
                  contract={contract}
                  verificationStatus={props.verificationStatus}
                  manuallyVerifiedContracts={props.manuallyVerifiedContracts}
                  className="my-4"
                />
              </React.Fragment>
            ))}
            {changedContracts.length > 0 && (
              <ImplementationHasChangedContracts
                contracts={changedContracts}
                manuallyVerifiedContracts={props.manuallyVerifiedContracts}
                verificationStatus={props.verificationStatus}
              />
            )}
          </div>
        </>
      )}
      {Object.keys(paritionedNativeContracts).length > 0 &&
        Object.entries(paritionedNativeContracts).map(
          ([chainName, [changedContracts, unchangedContracts]]) => {
            return (
              <div key={chainName}>
                <h3 className="font-bold">
                  The system consists of the following smart contracts on{' '}
                  {chainName}:
                </h3>
                <div className="my-4">
                  {unchangedContracts.map((contract, i) => (
                    <React.Fragment key={i}>
                      <ContractEntry
                        contract={contract}
                        verificationStatus={props.verificationStatus}
                        manuallyVerifiedContracts={
                          props.manuallyVerifiedContracts
                        }
                        className="my-4"
                      />
                    </React.Fragment>
                  ))}
                  {changedContracts.length > 0 && (
                    <ImplementationHasChangedContracts
                      contracts={changedContracts}
                      manuallyVerifiedContracts={
                        props.manuallyVerifiedContracts
                      }
                      verificationStatus={props.verificationStatus}
                    />
                  )}
                </div>
              </div>
            )
          },
        )}
      {/* @todo: this "if" can be dropped when all escrows will migrate to new form */}
      {props.escrows.length > 0 && (
        <>
          <h3 className="font-bold">
            Value Locked is calculated based on these smart contracts and
            tokens:
          </h3>
          <div className="my-4">
            {unchangedEscrows.map((contract, i) => (
              <React.Fragment key={i}>
                <ContractEntry
                  contract={contract}
                  verificationStatus={props.verificationStatus}
                  manuallyVerifiedContracts={props.manuallyVerifiedContracts}
                  className="my-4"
                />
              </React.Fragment>
            ))}
            {changedEscrows.length > 0 && (
              <ImplementationHasChangedContracts
                contracts={changedEscrows}
                manuallyVerifiedContracts={props.manuallyVerifiedContracts}
                verificationStatus={props.verificationStatus}
              />
            )}
          </div>
        </>
      )}
      {props.risks.length > 0 && (
        <>
          <p className="text-gray-850 dark:text-gray-400">
            The current deployment carries some associated risks:
          </p>
          <RiskList risks={props.risks} />
        </>
      )}
      <ReferenceList references={props.references} />
    </ProjectSection>
  )
}

function ImplementationHasChangedContracts(props: {
  contracts: TechnologyContract[]
  verificationStatus: VerificationStatus
  manuallyVerifiedContracts: ManuallyVerifiedContracts
}) {
  return (
    <div className="rounded-lg border border-yellow-200 border-dashed px-4 py-3">
      <div className="flex w-full items-center rounded bg-yellow-700/20 p-4">
        There are implementation changes and part of the information might be
        outdated.
      </div>
      {props.contracts.map((contract, i) => (
        <React.Fragment key={i}>
          <ContractEntry
            contract={contract}
            verificationStatus={props.verificationStatus}
            manuallyVerifiedContracts={props.manuallyVerifiedContracts}
            className="my-4 p-0"
          />
        </React.Fragment>
      ))}
    </div>
  )
}
