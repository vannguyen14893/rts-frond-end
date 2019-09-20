import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectCandidateComponent } from './reject-candidate.component';

describe('RejectCandidateComponent', () => {
  let component: RejectCandidateComponent;
  let fixture: ComponentFixture<RejectCandidateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RejectCandidateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectCandidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
