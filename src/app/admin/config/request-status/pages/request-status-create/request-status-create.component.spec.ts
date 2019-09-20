import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestStatusCreateComponent } from './request-status-create.component';

describe('RequestStatusCreateComponent', () => {
  let component: RequestStatusCreateComponent;
  let fixture: ComponentFixture<RequestStatusCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestStatusCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestStatusCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
