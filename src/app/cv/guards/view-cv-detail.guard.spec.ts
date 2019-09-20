import { TestBed, async, inject } from '@angular/core/testing';

import { ViewCvDetailGuard } from './view-cv-detail.guard';

describe('ViewCvDetailGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ViewCvDetailGuard]
    });
  });

  it('should ...', inject([ViewCvDetailGuard], (guard: ViewCvDetailGuard) => {
    expect(guard).toBeTruthy();
  }));
});
