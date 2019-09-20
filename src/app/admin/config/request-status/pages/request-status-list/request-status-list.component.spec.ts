import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestStatusListComponent } from './request-status-list.component';

describe('RequestStatusListComponent', () => {
  let component: RequestStatusListComponent;
  let fixture: ComponentFixture<RequestStatusListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestStatusListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestStatusListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
