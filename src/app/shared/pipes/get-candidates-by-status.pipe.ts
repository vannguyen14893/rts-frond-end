import { Observable } from 'rxjs/Observable';
import { CANDIDATE_STATUS } from './../constants/status.constant';
import { Candidate } from './../../model/candidate.class';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getCandidatesByStatus'
})
export class GetCandidatesByStatusPipe implements PipeTransform {

  transform(value: Candidate[], status: string): any {
    status = String(status).trim().toLowerCase();
    if (!value || value === null || value === []) {
      return [];
    }
    if (!status || status === 'all' || status === 'applied' || status === 'apply') {
      return value;
    }
    if (status === CANDIDATE_STATUS.QUALIFIED.toLowerCase()) {
      return value.filter(c => c.statusId.title !== CANDIDATE_STATUS.CLOSE);
    }
    if (status === CANDIDATE_STATUS.CLOSE.toLowerCase() || status === CANDIDATE_STATUS.DISQUALIFIED.toLowerCase()) {
      return value.filter(c => c.statusId.title === CANDIDATE_STATUS.CLOSE);
    }

    return value.filter(c => c.statusId && c.statusId.title.toLowerCase() === String(status).trim().toLowerCase());
  }

}
