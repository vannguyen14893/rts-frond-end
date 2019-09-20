import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportHrmemberComponent } from './report-hrmember.component';

describe('ReportHrmemberComponent', () => {
  let component: ReportHrmemberComponent;
  let fixture: ComponentFixture<ReportHrmemberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportHrmemberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportHrmemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
