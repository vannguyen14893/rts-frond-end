import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestLogListComponent } from './request-log-list.component';

describe('RequestLogListComponent', () => {
  let component: RequestLogListComponent;
  let fixture: ComponentFixture<RequestLogListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestLogListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestLogListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
