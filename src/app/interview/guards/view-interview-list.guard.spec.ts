import { TestBed, async, inject } from '@angular/core/testing';

import { ViewInterviewListGuard } from './view-interview-list.guard';

describe('ViewInterviewListGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ViewInterviewListGuard]
    });
  });

  it('should ...', inject([ViewInterviewListGuard], (guard: ViewInterviewListGuard) => {
    expect(guard).toBeTruthy();
  }));
});
