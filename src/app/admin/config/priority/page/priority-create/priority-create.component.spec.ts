import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriorityCreateComponent } from './priority-create.component';

describe('PriorityCreateComponent', () => {
  let component: PriorityCreateComponent;
  let fixture: ComponentFixture<PriorityCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriorityCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriorityCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
