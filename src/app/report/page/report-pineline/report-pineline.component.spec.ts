import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportPinelineComponent } from './report-pineline.component';

describe('ReportPinelineComponent', () => {
  let component: ReportPinelineComponent;
  let fixture: ComponentFixture<ReportPinelineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportPinelineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportPinelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
