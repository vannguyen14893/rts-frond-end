import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestManagementDetailComponent } from './request-management-detail.component';

describe('RequestManagementDetailComponent', () => {
  let component: RequestManagementDetailComponent;
  let fixture: ComponentFixture<RequestManagementDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestManagementDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestManagementDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
