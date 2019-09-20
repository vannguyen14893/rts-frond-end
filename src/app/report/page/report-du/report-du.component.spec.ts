import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportDuComponent } from './report-du.component';

describe('ReportDuComponent', () => {
  let component: ReportDuComponent;
  let fixture: ComponentFixture<ReportDuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportDuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportDuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
