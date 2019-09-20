import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateFiguresComponent } from './candidate-figures.component';

describe('CandidateFiguresComponent', () => {
  let component: CandidateFiguresComponent;
  let fixture: ComponentFixture<CandidateFiguresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateFiguresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateFiguresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
