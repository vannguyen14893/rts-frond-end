import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-candidate-status-figure',
  templateUrl: './candidate-status-figure.component.html',
  styleUrls: ['./candidate-status-figure.component.css']
})
export class CandidateStatusFigureComponent implements OnInit {

  @Input() number = 0;
  @Input() text = '';
  @Input() selected = '';

  constructor() { }

  ngOnInit() {
  }

}
