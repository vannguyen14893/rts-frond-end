import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestDetailHrMemberComponent } from './request-detail-hr-member.component';

describe('RequestDetailHrMemberComponent', () => {
  let component: RequestDetailHrMemberComponent;
  let fixture: ComponentFixture<RequestDetailHrMemberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestDetailHrMemberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestDetailHrMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
