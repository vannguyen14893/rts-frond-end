import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateActionBarComponent } from './candidate-action-bar.component';

describe('CandidateActionBarComponent', () => {
  let component: CandidateActionBarComponent;
  let fixture: ComponentFixture<CandidateActionBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateActionBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateActionBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
