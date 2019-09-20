import { Candidate } from './../../model/candidate.class';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getCommentsFromCandidate'
})
export class GetCommentsFromCandidatePipe implements PipeTransform {

  transform(value: Candidate, args?: any): any[] {
    if (!value || value === null) {
      return [];
    }
    return value.commentCollection;
  }

}
