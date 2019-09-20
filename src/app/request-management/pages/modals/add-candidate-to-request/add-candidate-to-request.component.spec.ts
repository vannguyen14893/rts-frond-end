import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCandidateToRequestComponent } from './add-candidate-to-request.component';

describe('AddCandidateToRequestComponent', () => {
  let component: AddCandidateToRequestComponent;
  let fixture: ComponentFixture<AddCandidateToRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCandidateToRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCandidateToRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
