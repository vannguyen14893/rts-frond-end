import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeCandidateStatusComponent } from './change-candidate-status.component';

describe('ChangeCandidateStatusComponent', () => {
  let component: ChangeCandidateStatusComponent;
  let fixture: ComponentFixture<ChangeCandidateStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeCandidateStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeCandidateStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
