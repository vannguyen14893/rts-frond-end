import { TestBed, async, inject } from '@angular/core/testing';

import { ViewReportGuard } from './view-report.guard';

describe('ViewReportGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ViewReportGuard]
    });
  });

  it('should ...', inject([ViewReportGuard], (guard: ViewReportGuard) => {
    expect(guard).toBeTruthy();
  }));
});
