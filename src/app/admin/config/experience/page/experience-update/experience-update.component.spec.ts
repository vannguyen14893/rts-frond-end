import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperienceUpdateComponent } from './experience-update.component';

describe('ExperienceUpdateComponent', () => {
  let component: ExperienceUpdateComponent;
  let fixture: ComponentFixture<ExperienceUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExperienceUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExperienceUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
