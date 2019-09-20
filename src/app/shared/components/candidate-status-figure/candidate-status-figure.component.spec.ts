import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateStatusFigureComponent } from './candidate-status-figure.component';

describe('CandidateStatusFigureComponent', () => {
  let component: CandidateStatusFigureComponent;
  let fixture: ComponentFixture<CandidateStatusFigureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateStatusFigureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateStatusFigureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
