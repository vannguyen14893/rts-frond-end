import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportHrmanagerComponent } from './report-hrmanager.component';

describe('ReportHrmanagerComponent', () => {
  let component: ReportHrmanagerComponent;
  let fixture: ComponentFixture<ReportHrmanagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportHrmanagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportHrmanagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
