import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriorityUpdateComponent } from './priority-update.component';

describe('PriorityUpdateComponent', () => {
  let component: PriorityUpdateComponent;
  let fixture: ComponentFixture<PriorityUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriorityUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriorityUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
