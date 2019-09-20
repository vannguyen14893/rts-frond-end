import { TestBed, inject } from '@angular/core/testing';

import { StoredProcedureService } from './stored-procedure.service';

describe('StoredProcedureService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StoredProcedureService]
    });
  });

  it('should be created', inject([StoredProcedureService], (service: StoredProcedureService) => {
    expect(service).toBeTruthy();
  }));
});
