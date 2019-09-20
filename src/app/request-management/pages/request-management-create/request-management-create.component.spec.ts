import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestManagementCreateComponent } from './request-management-create.component';

describe('RequestManagementCreateComponent', () => {
  let component: RequestManagementCreateComponent;
  let fixture: ComponentFixture<RequestManagementCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestManagementCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestManagementCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
