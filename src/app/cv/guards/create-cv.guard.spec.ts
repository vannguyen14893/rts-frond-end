import { TestBed, async, inject } from '@angular/core/testing';

import { CreateCvGuard } from './create-cv.guard';

describe('CreateCvGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CreateCvGuard]
    });
  });

  it('should ...', inject([CreateCvGuard], (guard: CreateCvGuard) => {
    expect(guard).toBeTruthy();
  }));
});
