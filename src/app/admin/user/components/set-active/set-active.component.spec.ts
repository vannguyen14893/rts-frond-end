import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetActiveComponent } from './set-active.component';

describe('SetActiveComponent', () => {
  let component: SetActiveComponent;
  let fixture: ComponentFixture<SetActiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetActiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetActiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
