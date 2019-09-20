import { TestBed, async, inject } from '@angular/core/testing';

import { CreateInterviewGuard } from './create-interview.guard';

describe('CreateInterviewGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CreateInterviewGuard]
    });
  });

  it('should ...', inject([CreateInterviewGuard], (guard: CreateInterviewGuard) => {
    expect(guard).toBeTruthy();
  }));
});
