import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Profilbar } from './profilbar';

describe('Profilbar', () => {
  let component: Profilbar;
  let fixture: ComponentFixture<Profilbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Profilbar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Profilbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
