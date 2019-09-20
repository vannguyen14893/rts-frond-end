import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendMeetingRequestComponent } from './send-meeting-request.component';

describe('SendMeetingRequestComponent', () => {
  let component: SendMeetingRequestComponent;
  let fixture: ComponentFixture<SendMeetingRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendMeetingRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendMeetingRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
