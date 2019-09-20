import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperienceCreateComponent } from './experience-create.component';

describe('ExperienceCreateComponent', () => {
  let component: ExperienceCreateComponent;
  let fixture: ComponentFixture<ExperienceCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExperienceCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExperienceCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
