import { getConfig } from "$stores/store_helpers";
import { ProposalStage, type ExtensionType, type ProposalEvent } from "@mijoco/stx_helpers/dist/index";

const DaoUtils = {


  setStatus: (burnHeight:number, proposal:ProposalEvent) => {    
    proposal.status = { name: 'unkown', color: 'primary-500', colorCode: 'primary-500' };
    if (proposal && typeof proposal.executedAt === 'number' && proposal.executedAt > 0 && typeof proposal.signals?.signals === 'number' && proposal.signals?.signals > 0) {
      proposal.stage = ProposalStage.CONCLUDED
      return { name: 'emergexec', color: 'success-500', colorCode: 'success-500' }
    }
    if (!proposal.proposalData) {
      proposal.stage = ProposalStage.UNFUNDED
      if (proposal.funding && proposal.funding.funding > 0) {
        proposal.stage = ProposalStage.PARTIAL_FUNDING
        proposal.status = { name: 'funding', color: 'info-500', colorCode: 'warning-500' };
      } else if (proposal.submitTxId) {
        proposal.status = { name: 'submitting', color: 'primary-500', colorCode: 'primary-500' };
      } else if (proposal.contract) {
        proposal.status = { name: 'deployed', color: 'primary-500', colorCode: 'primary-500' };
      } else {
        proposal.status = { name: 'draft', color: 'primary-500', colorCode: 'primary-500' };
      }
      const fundingMet = proposal.funding && proposal.funding.funding >= proposal.funding.parameters.fundingCost;
      if (fundingMet) proposal.stage = ProposalStage.PROPOSED
    } else {
      proposal.stage = ProposalStage.PROPOSED
      if (burnHeight >= proposal.proposalData.burnStartHeight) proposal.stage = ProposalStage.ACTIVE
      if (burnHeight >= proposal.proposalData.burnEndHeight) proposal.stage = ProposalStage.INACTIVE
      if (proposal.proposalData.concluded) {
        proposal.stage = ProposalStage.CONCLUDED
      }



      if (proposal.votingContract.indexOf(getConfig().VITE_DOA_PROPOSAL_VOTING_EXTENSION) > -1) {
        proposal.status = { name: 'submitted', color: 'primary-500', colorCode: 'primary-500' };
        if (burnHeight < proposal.proposalData.burnStartHeight) {
          proposal.status = { name: 'commencing soon', color: 'warning-500', colorCode: 'warning-500' };
        } else {
          proposal.status = { name: 'voting', color: 'warning-500', colorCode: 'warning-500' };
        }
      } else if (proposal.votingContract.indexOf(getConfig().VITE_DOA_SNAPSHOT_VOTING_EXTENSION) > -1) {
        proposal.status = { name: 'voting', color: 'warning-500', colorCode: 'warning-500' };
      } else if (proposal.votingContract.indexOf(getConfig().VITE_DOA_EMERGENCY_EXECUTE_EXTENSION) > -1) {
        proposal.status = { name: 'voting', color: 'warning-500', colorCode: 'warning-500' };
      }
      if (proposal.proposalData.concluded) {
        if (proposal.proposalData.passed) proposal.status = { name: 'passed', color: 'success-500', colorCode: 'success-500' };
        else proposal.status = { name: 'failed', color: 'danger-500', colorCode: 'error-500' };
      } else if (burnHeight > proposal.proposalData.burnEndHeight) {
        proposal.status = { name: 'voting ended', color: 'warning-500', colorCode: 'warning-500' };
      }
    }
    return status;
  },

  sortProposals: function (proposals: ProposalEvent[]|undefined, asc:boolean, sortField:string) {
    if (!proposals) return []
    proposals = proposals.sort(function compare (a:ProposalEvent, b:ProposalEvent) {
      let nameA = a.contractId.split('.')[1].toUpperCase() // ignore upper and lowercase
      let nameB = b.contractId.split('.')[1].toUpperCase() // ignore upper and lowercase
      if (sortField === 'status') {
        nameA = a.status?.name.toUpperCase() || '';
        nameB = b.status?.name.toUpperCase() || '';
      }
      if (nameA > nameB) {
        if (asc) {
          return -1;
        } else {
          return 1;
        }
      }
      if (nameA < nameB) {
        if (asc) {
          return 1;
        } else {
          return -1;
        }
      }
      // names must be equal
      return 0;
    })
    return proposals;
  },
  dynamicSort: function (property: any) {
    let sortOrder = 1;
    if (property[0] === "-") {
        sortOrder = -1;
        property = property.substring(1);
    }
    return function (a:any, b:any) {
        /* next line works with strings and numbers, 
         * and you may want to customize it to your needs
         */
        const result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
  },
  sortExtensions: function (extensions: ExtensionType[], asc:boolean, sortField:string) {
    if (!extensions) return []
    extensions = extensions.sort(function compare (a:ExtensionType, b:ExtensionType) {
      let nameA = a.contractId.split('.')[1].toUpperCase() // ignore upper and lowercase
      let nameB = b.contractId.split('.')[1].toUpperCase() // ignore upper and lowercase
      if (sortField === 'status') {
        nameA = (a.valid) ? 'active' : 'inactive';
        nameB = (b.valid) ? 'active' : 'inactive';               
      }
      if (nameA > nameB) {
        if (asc) {
          return -1;
        } else {
          return 1
        }
      }
      if (nameA < nameB) {
        if (asc) {
          return 1;
        } else {
          return -1
        }
      }
      // names must be equal
      return 0
    })
    return extensions;
  }
}
export default DaoUtils
