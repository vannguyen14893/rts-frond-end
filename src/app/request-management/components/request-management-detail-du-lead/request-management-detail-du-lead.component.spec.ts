import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestDetailDuLeadComponent } from './request-detail-du-lead.component';

describe('RequestDetailDuLeadComponent', () => {
  let component: RequestDetailDuLeadComponent;
  let fixture: ComponentFixture<RequestDetailDuLeadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestDetailDuLeadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestDetailDuLeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
