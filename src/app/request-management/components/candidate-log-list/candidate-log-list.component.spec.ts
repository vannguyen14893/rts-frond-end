import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateLogListComponent } from './candidate-log-list.component';

describe('CandidateLogListComponent', () => {
  let component: CandidateLogListComponent;
  let fixture: ComponentFixture<CandidateLogListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateLogListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateLogListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
