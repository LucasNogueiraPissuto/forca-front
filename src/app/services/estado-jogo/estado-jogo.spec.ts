import { TestBed } from '@angular/core/testing';

import { EstadoJogo } from './estado-jogo';

describe('EstadoJogo', () => {
  let service: EstadoJogo;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EstadoJogo);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
