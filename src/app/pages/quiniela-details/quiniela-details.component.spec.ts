import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuinielaDetailsComponent } from './quiniela-details.component';

describe('QuinielaDetailsComponent', () => {
  let component: QuinielaDetailsComponent;
  let fixture: ComponentFixture<QuinielaDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuinielaDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuinielaDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
