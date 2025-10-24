import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Modalajoutprofessionnel } from './modalajoutprofessionnel';

describe('Modalajoutprofessionnel', () => {
  let component: Modalajoutprofessionnel;
  let fixture: ComponentFixture<Modalajoutprofessionnel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Modalajoutprofessionnel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Modalajoutprofessionnel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
