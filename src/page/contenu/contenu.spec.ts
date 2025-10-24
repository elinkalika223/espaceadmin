import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Contenu } from './contenu';

describe('Contenu', () => {
  let component: Contenu;
  let fixture: ComponentFixture<Contenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Contenu]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Contenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
