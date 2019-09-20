import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCandidateToInterviewComponent } from './add-candidate-to-interview.component';

describe('AddCandidateToInterviewComponent', () => {
  let component: AddCandidateToInterviewComponent;
  let fixture: ComponentFixture<AddCandidateToInterviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCandidateToInterviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCandidateToInterviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
