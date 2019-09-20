import { Component, OnInit, Input } from '@angular/core';
import { Cv } from '../../../model/cv.class';
import { Experience } from '../../../model/experience.class';
import { Candidate } from '../../../model/candidate.class';
import { CandidateStatus } from '../../../model/candidate-status.class';
import { ActionCreatorService } from '../../../core/services/action-creator.service';

@Component({
  selector: 'app-candidate-list-card',
  templateUrl: './candidate-list-card.component.html',
  styleUrls: ['./candidate-list-card.component.css']
})
export class CandidateListCardComponent implements OnInit {
  @Input() cv: Cv;
  @Input() status: CandidateStatus;
  @Input() candidate: Number;

  constructor(
    private ac: ActionCreatorService,
  ) {}

  getColor () {
    switch (this.status.title) {
      case 'Apply':
        return '#4a4a4a';
      case 'Contacting':
        return '#2c82be';
      case 'Interview':
        return '#5ac8fa';
      case 'Offer':
        return '#50E3C2';
      case 'Onboard':
        return '#3ec556';
      default:
        return '#4a4a4a';
    }
  }
  navigateToRequestStatusBar (status, candidateId) {
    this.ac.setRequestStatusBar(status, candidateId);
  }

  ngOnInit() {
  }

}
