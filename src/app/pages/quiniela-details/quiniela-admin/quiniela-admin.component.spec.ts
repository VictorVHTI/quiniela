import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuinielaAdminComponent } from './quiniela-admin.component';

describe('QuinielaAdminComponent', () => {
  let component: QuinielaAdminComponent;
  let fixture: ComponentFixture<QuinielaAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuinielaAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuinielaAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
