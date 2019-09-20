import { TestBed, inject } from '@angular/core/testing';
import { PositionService } from './position.service';

describe('RequestStatusService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PositionService]
    });
  });

  it('should be created', inject([PositionService], (service: PositionService) => {
    expect(service).toBeTruthy();
  }));
});
