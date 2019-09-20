import { TestBed, async, inject } from '@angular/core/testing';

import { ViewInterviewDetailGuard } from './view-interview-detail.guard';

describe('ViewInterviewDetailGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ViewInterviewDetailGuard]
    });
  });

  it('should ...', inject([ViewInterviewDetailGuard], (guard: ViewInterviewDetailGuard) => {
    expect(guard).toBeTruthy();
  }));
});
