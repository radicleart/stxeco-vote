import type { IssueType } from "../../types/stxeco.type";

const SipUtils = {
  sortSips: function (issues: IssueType[], asc:boolean, sortField:string|number) {
    if (!issues) return []
    issues = issues.sort(function compare (a:IssueType, b:IssueType) {
      let nameA:string|number = a.title.toUpperCase() // ignore upper and lowercase
      let nameB:string|number = b.title.toUpperCase() // ignore upper and lowercase
      if (sortField === 'labels') {
        if (!a.labels) a.labels = [{ name: 'unknown', value: 'unknown' }]
        if (!b.labels) b.labels = [{ name: 'unknown', value: 'unknown' }]
        nameA = a.labels[0].name.toUpperCase()
        nameB = b.labels[0].name.toUpperCase()
      } else if (sortField === 'date') {
        nameA = a.createdAt
        nameB = b.createdAt
      } else if (sortField === 'updatedAt') {
        nameA = a.updatedAt
        nameB = b.updatedAt
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
    return issues
  }
}
export default SipUtils
