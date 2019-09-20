import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CvListV2Component } from './cv-list-v2.component';

describe('CvListV2Component', () => {
  let component: CvListV2Component;
  let fixture: ComponentFixture<CvListV2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CvListV2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CvListV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
