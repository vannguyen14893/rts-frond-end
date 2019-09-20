import { Component, OnInit, Input } from '@angular/core';
import { Candidate } from './../../../model/candidate.class';
import { Experience } from '../../../model/experience.class';

@Component({
  selector: 'app-candidate-header',
  templateUrl: './candidate-header.component.html',
  styleUrls: ['./candidate-header.component.css']
})
export class CandidateHeaderComponent implements OnInit {
  @Input() candidate: Candidate;

  constructor() {
  }

  ngOnInit() {
  }

}
