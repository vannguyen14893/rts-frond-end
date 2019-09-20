import { TestBed, async, inject } from '@angular/core/testing';

import { EditInterviewGuard } from './edit-interview.guard';

describe('EditInterviewGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EditInterviewGuard]
    });
  });

  it('should ...', inject([EditInterviewGuard], (guard: EditInterviewGuard) => {
    expect(guard).toBeTruthy();
  }));
});
