import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Modalpro } from './modalpro';

describe('Modalpro', () => {
  let component: Modalpro;
  let fixture: ComponentFixture<Modalpro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Modalpro]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Modalpro);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
