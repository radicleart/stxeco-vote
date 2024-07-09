import { type ExtensionType, type VotingEventProposeProposal } from "@mijoco/stx_helpers/dist/index";

const DaoUtils = {
  sortProposals: function (proposals: VotingEventProposeProposal[]|undefined, asc:boolean, sortField:string) {
    if (!proposals) return []
    proposals = proposals.sort(function compare (a:VotingEventProposeProposal, b:VotingEventProposeProposal) {
      let nameA:string|number = a.proposal.split('.')[1].toUpperCase() // ignore upper and lowercase
      let nameB:string|number = b.proposal.split('.')[1].toUpperCase() // ignore upper and lowercase
      if (sortField === 'status') {
        nameA = a.proposalData?.burnStartHeight || 0;
        nameB = b.proposalData?.burnStartHeight || 0;
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
