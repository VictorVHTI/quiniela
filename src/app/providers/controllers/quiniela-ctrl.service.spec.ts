import { TestBed } from '@angular/core/testing';

import { QuinielaCtrlService } from './quiniela-ctrl.service';

describe('QuinielaCtrlService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: QuinielaCtrlService = TestBed.get(QuinielaCtrlService);
    expect(service).toBeTruthy();
  });
});
