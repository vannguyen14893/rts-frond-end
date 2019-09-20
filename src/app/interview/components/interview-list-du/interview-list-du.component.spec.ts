import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewListDuComponent } from './interview-list-du.component';

describe('InterviewListDuComponent', () => {
  let component: InterviewListDuComponent;
  let fixture: ComponentFixture<InterviewListDuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterviewListDuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterviewListDuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
