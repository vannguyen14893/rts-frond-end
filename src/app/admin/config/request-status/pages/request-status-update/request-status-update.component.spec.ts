import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestStatusUpdateComponent } from './request-status-update.component';

describe('RequestStatusUpdateComponent', () => {
  let component: RequestStatusUpdateComponent;
  let fixture: ComponentFixture<RequestStatusUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestStatusUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestStatusUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
