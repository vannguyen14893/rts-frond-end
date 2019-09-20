import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateStatusCreateComponent } from './candidate-status-create.component';

describe('CandidateStatusCreateComponent', () => {
  let component: CandidateStatusCreateComponent;
  let fixture: ComponentFixture<CandidateStatusCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateStatusCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateStatusCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
