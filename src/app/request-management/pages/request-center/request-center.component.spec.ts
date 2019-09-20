import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestCenterComponent } from './request-center.component';

describe('RequestCenterComponent', () => {
  let component: RequestCenterComponent;
  let fixture: ComponentFixture<RequestCenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestCenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
