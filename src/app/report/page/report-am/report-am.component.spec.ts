import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportAmComponent } from './report-am.component';

describe('ReportDaComponent', () => {
  let component: ReportAmComponent;
  let fixture: ComponentFixture<ReportAmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportAmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportAmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
