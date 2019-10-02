import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FillForecastComponent } from './fill-forecast.component';

describe('FillForecastComponent', () => {
  let component: FillForecastComponent;
  let fixture: ComponentFixture<FillForecastComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FillForecastComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FillForecastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
