import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestDetailDuMemberComponent } from './request-detail-du-member.component';

describe('RequestDetailDuMemberComponent', () => {
  let component: RequestDetailDuMemberComponent;
  let fixture: ComponentFixture<RequestDetailDuMemberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestDetailDuMemberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestDetailDuMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
