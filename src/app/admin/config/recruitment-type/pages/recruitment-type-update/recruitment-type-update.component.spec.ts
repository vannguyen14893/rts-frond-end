import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruitmentTypeUpdateComponent } from './recruitment-type-update.component';

describe('RecruitmentTypeUpdateComponent', () => {
  let component: RecruitmentTypeUpdateComponent;
  let fixture: ComponentFixture<RecruitmentTypeUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecruitmentTypeUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecruitmentTypeUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
