import { Candidate } from './../../model/candidate.class';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getCandidatesByAssignee'
})
export class GetCandidatesByAssigneePipe implements PipeTransform {

  transform(value: Candidate[], assigneeId: number): any {
    if (!value || value === null || value === []) {
      return [];
    }
    return value.filter(c => c.createdBy.id === assigneeId);
  }

}
