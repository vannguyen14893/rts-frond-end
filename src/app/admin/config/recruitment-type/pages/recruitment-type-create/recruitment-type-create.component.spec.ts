import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruitmentTypeCreateComponent } from './recruitment-type-create.component';

describe('RecruitmentTypeCreateComponent', () => {
  let component: RecruitmentTypeCreateComponent;
  let fixture: ComponentFixture<RecruitmentTypeCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecruitmentTypeCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecruitmentTypeCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
