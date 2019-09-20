import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateStatusListComponent } from './candidate-status-list.component';

describe('CandidateStatusListComponent', () => {
  let component: CandidateStatusListComponent;
  let fixture: ComponentFixture<CandidateStatusListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateStatusListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateStatusListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
