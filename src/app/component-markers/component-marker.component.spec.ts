import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentMarkerComponent } from './component-marker.component';

describe('ComponentMarkerComponent', () => {
  let component: ComponentMarkerComponent;
  let fixture: ComponentFixture<ComponentMarkerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComponentMarkerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentMarkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
