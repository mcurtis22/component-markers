import { TestBed, inject } from '@angular/core/testing';

import { ComponentMarkerFactoryService } from './component-marker-factory.service';

describe('ComponentMarkerFactoryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ComponentMarkerFactoryService]
    });
  });

  it('should be created', inject([ComponentMarkerFactoryService], (service: ComponentMarkerFactoryService) => {
    expect(service).toBeTruthy();
  }));
});
