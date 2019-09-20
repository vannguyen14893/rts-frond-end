import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateStatusUpdateComponent } from './candidate-status-update.component';

describe('CandidateStatusUpdateComponent', () => {
  let component: CandidateStatusUpdateComponent;
  let fixture: ComponentFixture<CandidateStatusUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateStatusUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateStatusUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
