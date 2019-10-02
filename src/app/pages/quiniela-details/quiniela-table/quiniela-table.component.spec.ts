import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuinielaTableComponent } from './quiniela-table.component';

describe('QuinielaTableComponent', () => {
  let component: QuinielaTableComponent;
  let fixture: ComponentFixture<QuinielaTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuinielaTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuinielaTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
